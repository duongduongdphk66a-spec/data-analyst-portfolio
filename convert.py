import os, re
import json

base_dir = r'c:\Users\ADMIN\Documents\data-analyst-portfolio'
pages = ['architecture-graph.html', 'understand_dashboard.html', 'presentation.html']
out_folders = ['architecture', 'dashboard', 'presentation']

for page, folder in zip(pages, out_folders):
    html_file = os.path.join(base_dir, 'public', 'library-bus', page)
    out_dir = os.path.join(base_dir, 'app', 'projects', 'library-bus', folder)
    os.makedirs(out_dir, exist_ok=True)

    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract styles
    style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    styles = style_match.group(1) if style_match else ''

    # Extract script
    # Some files have multiple scripts (like understand_dashboard with vis-network)
    # We want to extract ALL inline script contents
    scripts = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)
    script_content = '\n'.join(scripts)
    
    # Check for external scripts (src=)
    external_scripts = re.findall(r'<script[^>]*src="([^"]+)"[^>]*></script>', content)

    # Extract body HTML
    # We want the content inside <body> but WITHOUT the <script> tags
    body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL)
    body_html = body_match.group(1) if body_match else ''
    
    # Remove script tags from body
    body_html = re.sub(r'<script.*?</script>', '', body_html, flags=re.DOTALL)

    # Convert basic HTML to JSX
    jsx_html = body_html.replace('class=', 'className=')
    jsx_html = jsx_html.replace('onclick=', 'onClick=')
    jsx_html = jsx_html.replace('<!--', '{/*').replace('-->', '*/}')
    # Simple fix for style="..." by stripping it or trying to parse it (better to strip to avoid syntax errors)
    jsx_html = re.sub(r'style="[^"]+"', '', jsx_html)
    
    # Self close tags that are unclosed like <img>, <input>, <br>
    jsx_html = re.sub(r'<(img|input|br|hr)([^>]*?)(?<!/)>', r'<\1\2 />', jsx_html)
    
    # Next/script for external scripts
    next_scripts = '\n'.join([f'<Script src="{src}" strategy="afterInteractive" />' for src in external_scripts])
    script_imports = "import Script from 'next/script';" if external_scripts else ""

    # Escape backticks and standard JS variables in JSX
    escaped_jsx = jsx_html.replace('`', '\\`')
    escaped_styles = styles.replace('`', '\\`')
    
    component_name = folder.capitalize()

    tsx_content = f"""'use client';
import React, {{ useEffect, useRef }} from 'react';
{script_imports}

export default function {{component_name}}Demo() {{
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {{
    if (!containerRef.current) return;
    
    // Scoped script execution
    const runScript = () => {{
      {script_content}
    }};
    
    // Give DOM time to paint before running heavy scripts
    const timer = setTimeout(() => {{
      try {{
        runScript();
      }} catch (e) {{
        console.error('Demo Script Error:', e);
      }}
    }}, 100);
    
    return () => clearTimeout(timer);
  }}, []);

  return (
    <>
      {next_scripts}
      <style dangerouslySetInnerHTML={{{{ __html: `{escaped_styles}` }}}} />
      <div 
        ref={{containerRef}} 
        dangerouslySetInnerHTML={{{{ __html: `{escaped_jsx}` }}}} 
        className="w-full min-h-screen bg-slate-900" 
      />
    </>
  );
}}
"""
    # Replace the placeholder {{component_name}}
    tsx_content = tsx_content.replace('{component_name}', component_name)

    with open(os.path.join(out_dir, 'page.tsx'), 'w', encoding='utf-8') as f:
        f.write(tsx_content)

print('Converted all HTML files to Next.js pages successfully!')
