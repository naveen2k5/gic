
import os

file_path = r"d:\Antigravity projects\GIC\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Verify the content before replacing to be safe
if "GIC <span" in lines[46]:
    print("Found target lines.")
    lines[46] = '                <img src="gic logo.png" alt="GIC Manesar Logo" style="height: 50px;">\n'
    del lines[47]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Successfully updated logo.")
else:
    print("Target lines not found at expected position.")
    print(f"Line 47 content: {lines[46]}")
