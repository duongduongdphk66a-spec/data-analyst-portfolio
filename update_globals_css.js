const fs = require('fs');
let content = fs.readFileSync('app/globals.css', 'utf8');

const replacements = [
    { from: /var\(--color-ink\)/g, to: 'var(--color-text)' },
    { from: /var\(--color-ink-secondary\)/g, to: 'var(--color-text)' },
    { from: /var\(--color-ink-muted\)/g, to: 'var(--color-text-muted)' },
    { from: /var\(--color-ground\)/g, to: 'var(--color-surface)' },
    { from: /var\(--color-ground-alt\)/g, to: 'var(--color-surface)' },
    { from: /var\(--color-surface-tint\)/g, to: 'var(--color-surface-raised)' },
    { from: /var\(--color-surface-vivid\)/g, to: 'var(--color-brand-primary)' },
    { from: /var\(--color-border-subtle\)/g, to: 'var(--color-border)' },
    { from: /var\(--color-border-strong\)/g, to: 'var(--color-border)' },
    { from: /var\(--font-heading\)/g, to: 'var(--font-sans)' },
    { from: /var\(--font-body\)/g, to: 'var(--font-sans)' },
    { from: /var\(--color-brand-blue-vivid\)/g, to: 'var(--color-brand-primary)' },
    { from: /var\(--color-brand-blue-light\)/g, to: 'var(--color-brand-primary-hover)' },
    { from: /var\(--color-brand-yellow\)/g, to: 'var(--color-accent)' },
    { from: /var\(--color-brand-yellow-light\)/g, to: 'var(--color-accent)' },
    { from: /var\(--color-brand-blue\)/g, to: 'var(--color-brand-primary)' },
    { from: /var\(--color-accent-soft\)/g, to: 'var(--color-accent)' },
    { from: /var\(--color-accent-deep\)/g, to: 'var(--color-accent)' },
];

for (const rule of replacements) {
    content = content.replace(rule.from, rule.to);
}

fs.writeFileSync('app/globals.css', content);
console.log('globals.css updated');
