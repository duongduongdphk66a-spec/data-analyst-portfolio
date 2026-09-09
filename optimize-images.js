const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const convertedFiles = new Set();

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.match(/\.(png|jpg|jpeg)$/i)) {
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      const newPath = path.join(dir, `${baseName}.webp`);
      
      console.log(`Attempting to convert ${file}...`);
      try {
        await sharp(fullPath)
          .webp({ quality: 80 })
          .toFile(newPath);
          
        fs.unlinkSync(fullPath);
        convertedFiles.add(file);
        console.log(`✅ Success: ${file} -> .webp`);
      } catch (err) {
        console.error(`❌ Failed to convert ${file}: ${err.message}. Attempting to compress in place...`);
        // If webp fails, try to just compress it as its original format
        const tempPath = path.join(dir, `${baseName}_temp${ext}`);
        try {
          if (ext.toLowerCase() === '.png') {
            await sharp(fullPath).png({ quality: 80, compressionLevel: 9 }).toFile(tempPath);
          } else {
            await sharp(fullPath).jpeg({ quality: 80 }).toFile(tempPath);
          }
          fs.unlinkSync(fullPath);
          fs.renameSync(tempPath, fullPath);
          console.log(`✅ Success: Compressed ${file} in place.`);
        } catch (e) {
           console.error(`❌ Failed to compress ${file} in place: ${e.message}`);
           if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
      }
    }
  }
}

function replaceInCode(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceInCode(fullPath);
    } else if (file.match(/\.(ts|tsx|js|jsx)$/i)) {
      if (file === 'chartExport.ts') continue;
      
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Only replace if the file was actually converted
      for (const convertedFile of convertedFiles) {
        const ext = path.extname(convertedFile);
        const base = path.basename(convertedFile, ext);
        // Replace exact filename
        const regex = new RegExp(`(${base})\\.(${ext.substring(1)})`, 'gi');
        content = content.replace(regex, `$1.webp`);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated references in ${fullPath}`);
      }
    }
  }
}

async function main() {
  console.log('Optimizing images in public/ ...');
  await processDirectory(path.join(__dirname, 'public'));
  
  console.log('Updating code references in app/ ...');
  replaceInCode(path.join(__dirname, 'app'));
  replaceInCode(path.join(__dirname, 'defaultData.ts'));
  
  console.log('Done!');
}

main().catch(console.error);
