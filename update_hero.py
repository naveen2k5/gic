import re

# Read the original HTML
with open('d:/Antigravity projects/GIC/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Read the new hero section
with open('d:/Antigravity projects/GIC/hero-section-new.html', 'r', encoding='utf-8') as f:
    new_hero = f.read()

# Find and replace the hero section
pattern = r'    <!-- Hero Section -->.*?    </section>'
content = re.sub(pattern, new_hero, content, flags=re.DOTALL)

# Add CSS and JS links if not already present
if 'hero-new.css' not in content:
    content = content.replace(
        '<link rel="stylesheet" href="form-enhanced.css">',
        '<link rel="stylesheet" href="form-enhanced.css">\n    <link rel="stylesheet" href="hero-new.css">'
    )

if 'carousel.js' not in content:
    content = content.replace(
        '</body>',
        '    <script src="carousel.js"></script>\n</body>'
    )

# Write the updated HTML
with open('d:/Antigravity projects/GIC/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Hero section successfully updated!")
