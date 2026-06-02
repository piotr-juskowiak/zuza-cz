import os
article_files = [
    'inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka.html',
    'nowe-inicjatywy-na-rzecz-ochrony-zapylaczy.html',
    'projekt-brodnica-beehouses-2025-edukacja-o-zapylaczach.html',
    'udzial-w-pracach-nad-narodowym-programem-lesnym.html',
    'warsztaty-pszczelarskie-w-ramach-projektu-beehouses-v2.html'
]
for f in article_files:
    if os.path.exists(f):
        with open(f, 'r') as file:
            content = file.read()
        content = content.replace('    <!-- Article Section -->', '    </div>\n\n    <!-- Article Section -->')
        with open(f, 'w') as file:
            file.write(content)
print("Added missing div closing tags!")
