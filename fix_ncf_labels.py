import os
import glob

template_dir = r'c:\Users\marke\Documents\Sysfac\src\components\templates'

replacements = [
    ('FACTURA:</span> <span className="font-bold">#{document.number}', 'NCF:</span> <span className="font-bold">{document.number}'),
    ('No.:</span> <span className="font-bold">{document.number}', 'NCF:</span> <span className="font-mono font-bold">{document.number}'),
    ('<span>No.:</span>', '<span>NCF:</span>'),
    ('#{document.number}', '{document.number}'),
    ('No. {document.number}', 'NCF: {document.number}'),
    ('No.:</span>', 'NCF:</span>'),
]

for filepath in glob.glob(os.path.join(template_dir, '*.tsx')):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for old, new in replacements:
        content = content.replace(old, new)
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed {os.path.basename(filepath)}')
print('Done')
