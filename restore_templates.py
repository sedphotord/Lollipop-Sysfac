import os
import json
import shutil
import urllib.parse

history_dir = os.path.expandvars(r"%APPDATA%\Code\User\History")
target_dir = r"c:\Users\marke\Documents\Sysfac\src\components\templates"

# Ensure target directory exists
os.makedirs(target_dir, exist_ok=True)

restored_files = []

for root, dirs, files in os.walk(history_dir):
    if "entries.json" in files:
        entries_path = os.path.join(root, "entries.json")
        try:
            with open(entries_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            resource = data.get("resource", "")
            # urldecode
            resource = urllib.parse.unquote(resource)
            
            if "src/components/templates/" in resource and resource.endswith(".tsx"):
                filename = os.path.basename(resource)
                entries = data.get("entries", [])
                
                if entries:
                    # Sort by timestamp descending
                    entries.sort(key=lambda x: x.get("timestamp", 0), reverse=True)
                    
                    found_good_file = False
                    for entry in entries:
                        entry_id = entry.get("id")
                        entry_file = os.path.join(root, entry_id)
                        
                        if os.path.exists(entry_file):
                            # Ensure it's not the empty truncated version (size > 50 bytes)
                            if os.path.getsize(entry_file) > 50:
                                dest_path = os.path.join(target_dir, filename)
                                shutil.copy2(entry_file, dest_path)
                                print(f"Restored {filename} from {entry_file} (timestamp {entry.get('timestamp')})")
                                restored_files.append(filename)
                                found_good_file = True
                                break
                    if not found_good_file:
                        print(f"Could not find a non-empty backup for {filename}")
        except Exception as e:
            pass

print(f"Total restored files: {len(restored_files)}")
