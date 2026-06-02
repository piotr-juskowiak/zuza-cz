import re
import os

article_files = [
    'inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka.html',
    'nowe-inicjatywy-na-rzecz-ochrony-zapylaczy.html',
    'projekt-brodnica-beehouses-2025-edukacja-o-zapylaczach.html',
    'udzial-w-pracach-nad-narodowym-programem-lesnym.html',
    'warsztaty-pszczelarskie-w-ramach-projektu-beehouses-v2.html'
]

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

# Extract Mobile menu JS script
script_match = re.search(r'(<script>\s*// --- LOGIKA MENU MOBILNEGO ---.*?</script>)', idx_content, re.DOTALL)
script_html = script_match.group(1) if script_match else ""

for fname in article_files:
    if not os.path.exists(fname): continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Inject JS if missing
    if "LOGIKA MENU MOBILNEGO" not in content and script_html:
        content = content.replace('</body>', script_html + '\n</body>')

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)

print("JS injected successfully.")
