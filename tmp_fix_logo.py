import os
import re
import glob

template_dir = r"c:\Users\marke\Documents\Sysfac\src\components\templates"

for filepath in glob.glob(os.path.join(template_dir, "*.tsx")):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Case 1: Existing [LOGO] placeholder
    pattern1 = re.compile(r'\{data\.company\.logo \? \(\s*<div[^>]*>\s*\{/\*.*?\*/\}\s*<div[^>]*>\s*\[LOGO\] \{data\.company\.name\}\s*</div>\s*</div>\s*\) : \(', re.DOTALL)
    if pattern1.search(content):
        content = pattern1.sub(r'{data.company.logo ? (\n                        <img src={data.company.logo} alt={data.company.name} className="h-16 object-contain mb-4" />\n                    ) : (', content)

    # Case 2: Just LOGO placeholder text 
    pattern2 = re.compile(r'\{data\.company\.logo \? \(\s*<div[^>]*>\s*LOGO\s*</div>\s*\) : \(', re.DOTALL)
    if pattern2.search(content):
        content = pattern2.sub(r'{data.company.logo ? (\n                        <img src={data.company.logo} alt={data.company.name} className="h-16 object-contain mb-4" />\n                    ) : (', content)

    # Case 3: No logo logic, just <h1...>{data.company.name}</h1>
    pattern3 = re.compile(r'(<h1[^>]*>\{data\.company\.name\}</h1>)')
    
    # But only apply Case 3 if not already wrapped in data.company.logo ?
    if not '{data.company.logo ?' in content and 'TicketPOS' not in filepath and 'Email' not in filepath:
        content = pattern3.sub(r'{data.company.logo ? (\n                        <img src={data.company.logo} alt={data.company.name} className="h-16 object-contain mb-4" />\n                    ) : (\n                        \1\n                    )}', content)
        
    if 'TicketPOS' in filepath and not '{data.company.logo ?' in content:
        # For Ticket POS we want smaller logo
        pattern_ticket = re.compile(r'(<h1[^>]*>\{data\.company\.name\}</h1>)')
        content = pattern_ticket.sub(r'{data.company.logo ? (\n                    <img src={data.company.logo} alt={data.company.name} className="h-12 w-12 mx-auto object-contain mb-2 grayscale" />\n                ) : (\n                    \1\n                )}', content)


    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {os.path.basename(filepath)}")
