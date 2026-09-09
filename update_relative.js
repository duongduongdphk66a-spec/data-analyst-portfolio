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
    { from: /\.\.\/\.\.\/data\//g, to: '@/app/data/' },
    { from: /\.\.\/data\//g, to: '@/app/data/' },
    { from: /\.\.\/\.\.\/context\//g, to: '@/app/context/' },
    { from: /\.\.\/context\//g, to: '@/app/context/' },
    { from: /\.\.\/\.\.\/lib\//g, to: '@/app/lib/' },
    { from: /\.\.\/lib\//g, to: '@/app/lib/' },
    { from: /\.\.\/\.\.\/defaultData/g, to: '@/app/defaultData' },
    { from: /\.\.\/defaultData/g, to: '@/app/defaultData' },
    { from: /\.\.\/\.\.\/types/g, to: '@/app/types' },
    { from: /\.\.\/types/g, to: '@/app/types' },
    // Also, UI helpers that moved to `@/components/ui/` might be imported wrongly if they use `../ui/` instead of `@/components/ui/`
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
