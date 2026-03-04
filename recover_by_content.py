import os
import glob
import re

history_dir = os.path.expandvars(r"%APPDATA%\Code\User\History")
target_dir = r"c:\Users\marke\Documents\Sysfac\src\components\templates"

# We know the names of the templates missing
templates = [
    "AccountStatement", "DeliveryNote", "InvoiceCorporate", "InvoiceElegant",
    "InvoiceMinimal", "InvoiceModern", "InvoiceStandard", "PaymentReceipt",
    "PurchaseOrder", "QuoteDetailed", "QuoteStandard", "TicketPOS",
    "EmailInvoice", "EmailQuote", "EmailReceipt"
]

for t in templates:
    print(f"Searching for {t}...")
    best_file = None
    best_time = 0
    best_content = ""
    
    # search all files in history
    for root, dirs, files in os.walk(history_dir):
        for file in files:
            if len(file) > 2 and file != "entries.json":
                filepath = os.path.join(root, file)
                try:
                    mtime = os.path.getmtime(filepath)
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        if f"export function {t}" in content or f"export const {t}" in content:
                            if mtime > best_time and len(content) > 50:
                                best_time = mtime
                                best_file = filepath
                                best_content = content
                except Exception:
                    pass
    
    if best_file:
        dest = os.path.join(target_dir, f"{t}.tsx")
        with open(dest, 'w', encoding='utf-8') as f:
            f.write(best_content)
        print(f"Recovered {t}.tsx from {best_file}")
    else:
        print(f"FAILED to find {t}.tsx")
