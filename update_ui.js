const fs = require('fs');
const path = require('path');

const walk = function(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        if (file === 'node_modules' || file === '.next' || file === '.git') return;
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./components');

const replacements = [
    { from: /\.\.\/ui\//g, to: '@/components/ui/' },
    { from: /\.\/ui\//g, to: '@/components/ui/' },
    { from: /\.\.\/\.\.\/ui\//g, to: '@/components/ui/' }
];

let changedFiles = 0;
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    for (const rule of replacements) {
        content = content.replace(rule.from, rule.to);
    }
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        changedFiles++;
        console.log('Updated: ' + file);
    }
}
console.log('Total files updated: ' + changedFiles);
