import os

filepath = r"c:\Users\marke\Documents\Sysfac\src\app\dashboard\pos\page.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace font-black with font-bold
content = content.replace('font-black', 'font-bold')

# Replace tracking tracking-widest with tracking-wider
content = content.replace('tracking-widest', 'tracking-wider')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated fonts and tracking in POS page")
