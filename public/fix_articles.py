import re
import os

article_files = [
    'inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka.html',
    'nowe-inicjatywy-na-rzecz-ochrony-zapylaczy.html',
    'projekt-brodnica-beehouses-2025-edukacja-o-zapylaczach.html',
    'udzial-w-pracach-nad-narodowym-programem-lesnym.html',
    'warsztaty-pszczelarskie-w-ramach-projektu-beehouses-v2.html'
]

# Read index.html for updated blocks
with open('index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

# 1. Styles
head_match = re.search(r'<head>.*?</head>', idx_content, re.DOTALL)
idx_styles = "".join(re.findall(r'<style>.*?</style>', head_match.group(0), re.DOTALL))

# 2. Nav
nav_match = re.search(r'(<!-- TOP NAVIGATION -->\s*<nav id="navbar">.*?)</nav>', idx_content, re.DOTALL)
nav_html = nav_match.group(1) + "</nav>"

# 3. Mobile Menu
menu_match = re.search(r'(<!-- FULLSCREEN MOBILE MENU -->.*?</div>\s*</div>)', idx_content, re.DOTALL)
menu_html = menu_match.group(1) if menu_match else ""

# 4. Footer
footer_match = re.search(r'(<footer class="modern-footer">.*?</footer>)', idx_content, re.DOTALL)
footer_html = footer_match.group(1) if footer_match else ""

# 5. Mobile menu JS script
script_match = re.search(r'(<script>\s*// Fullscreen Mobile Menu Logic.*?</script>)', idx_content, re.DOTALL)
script_html = script_match.group(1) if script_match else ""

for fname in article_files:
    if not os.path.exists(fname): continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract ARTICLE SPECIFIC STYLES
    # It might be between /* --- ARTICLE SPECIFIC STYLES --- */ and /* --- MODERN FOOTER STYLES (FROM MAIN PAGE) --- */ or </style>
    art_styles_match = re.search(r'(/\* --- ARTICLE SPECIFIC STYLES --- \*/.*?)(/\* --- MODERN FOOTER STYLES.*?|</style>)', content, re.DOTALL)
    art_styles = art_styles_match.group(1) if art_styles_match else ""

    # Replace head styles
    def head_replacer(match):
        h = match.group(0)
        h = re.sub(r'<style>.*?</style>', '', h, flags=re.DOTALL)
        new_styles = idx_styles + "\n<style>\n" + art_styles + "\n</style>\n"
        return h.replace('</head>', new_styles + '</head>')
        
    content = re.sub(r'<head>.*?</head>', head_replacer, content, flags=re.DOTALL)

    # Replace Nav
    # Article files have <!-- Navigation --> <nav id="navbar"> ... </nav>
    content = re.sub(r'(<!-- Navigation -->\s*)?<nav id="navbar">.*?</nav>', nav_html + "\n\n    " + menu_html, content, flags=re.DOTALL)

    # Replace Footer
    content = re.sub(r'(<!-- MODERN MEGA FOOTER -->\s*)?<footer class="modern-footer">.*?</footer>', footer_html, content, flags=re.DOTALL)
    
    # Inject JS if missing
    if "Fullscreen Mobile Menu Logic" not in content and script_html:
        content = content.replace('</body>', script_html + '\n</body>')

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)

print("Articles updated successfully.")
