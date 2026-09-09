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

const files = walk('./app').concat(walk('./components'));

const replacements = [
    // UI
    { from: /@\/app\/components\/ui\//g, to: '@/components/ui/' },
    { from: /\.\.\/components\/ui\//g, to: '@/components/ui/' },
    { from: /\.\.\/\.\.\/components\/ui\//g, to: '@/components/ui/' },
    
    // Admin
    { from: /@\/app\/components\/admin\//g, to: '@/components/admin/' },
    { from: /\.\.\/components\/admin\//g, to: '@/components/admin/' },
    
    // Case Studies Folders
    { from: /@\/app\/components\/heritage-japan\//g, to: '@/components/case-studies/' },
    { from: /@\/app\/components\/kami-ely\//g, to: '@/components/case-studies/' },
    { from: /@\/app\/components\/library-bus\//g, to: '@/components/case-studies/' },
    { from: /@\/app\/components\/charts\//g, to: '@/components/case-studies/' },

    // Site components that were in app/components/
    { from: /@\/app\/components\/HeroSection/g, to: '@/components/site/HeroSection' },
    { from: /@\/app\/components\/AboutSection/g, to: '@/components/site/AboutSection' },
    { from: /@\/app\/components\/CVSection/g, to: '@/components/site/CVSection' },
    { from: /@\/app\/components\/DashboardSection/g, to: '@/components/site/DashboardSection' },
    { from: /@\/app\/components\/ProjectsSection/g, to: '@/components/site/ProjectsSection' },
    { from: /@\/app\/components\/InteractiveLab/g, to: '@/components/site/InteractiveLab' },
    { from: /@\/app\/components\/Sidebar/g, to: '@/components/site/Sidebar' },

    // Case Studies Root
    { from: /@\/app\/components\/KamiElyProject/g, to: '@/components/case-studies/KamiElyProject' },
    { from: /@\/app\/components\/HeritageJapanProject/g, to: '@/components/case-studies/HeritageJapanProject' },
    { from: /@\/app\/components\/LibraryBusProject/g, to: '@/components/case-studies/LibraryBusProject' },
    { from: /@\/app\/components\/ProjectDetailView/g, to: '@/components/case-studies/ProjectDetailView' },
    
    // Catch-all relative
    { from: /\.\.\/components\/KamiElyProject/g, to: '@/components/case-studies/KamiElyProject' },
    { from: /\.\.\/components\/HeritageJapanProject/g, to: '@/components/case-studies/HeritageJapanProject' },
    { from: /\.\.\/components\/LibraryBusProject/g, to: '@/components/case-studies/LibraryBusProject' },
    { from: /\.\.\/components\/ProjectDetailView/g, to: '@/components/case-studies/ProjectDetailView' },
    
    { from: /\.\.\/components\/HeroSection/g, to: '@/components/site/HeroSection' },
    { from: /\.\.\/components\/AboutSection/g, to: '@/components/site/AboutSection' },
    { from: /\.\.\/components\/CVSection/g, to: '@/components/site/CVSection' },
    { from: /\.\.\/components\/DashboardSection/g, to: '@/components/site/DashboardSection' },
    { from: /\.\.\/components\/ProjectsSection/g, to: '@/components/site/ProjectsSection' },
    { from: /\.\.\/components\/InteractiveLab/g, to: '@/components/site/InteractiveLab' },
    { from: /\.\.\/components\/Sidebar/g, to: '@/components/site/Sidebar' },
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
