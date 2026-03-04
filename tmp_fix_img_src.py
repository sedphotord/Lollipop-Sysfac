import os
import glob

template_dir = r"c:\Users\marke\Documents\Sysfac\src\components\templates"

for filepath in glob.glob(os.path.join(template_dir, "*.tsx")):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace src={data.company.logo} with src={data.company.logo || undefined}
    if "src={data.company.logo}" in content:
        content = content.replace('src={data.company.logo}', 'src={data.company.logo || undefined}')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed src null check in {os.path.basename(filepath)}")
