import os
import re

def resolve_to_head(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        pattern = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> [^\n]*\n?', re.DOTALL)
        new_content, count = pattern.subn(r'\1\n', content)
        
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Resolved {count} conflicts in {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

files = [
    r'apps\web\src\pages\CategoryPage.tsx',
    r'apps\web\src\pages\CollectionsPage.tsx',
    r'apps\web\src\utils\rates.ts',
    r'pnpm-workspace.yaml'
]

for file in files:
    if os.path.exists(file):
        resolve_to_head(file)
    else:
        print(f"File not found: {file}")
