const fs = require('fs');
const path = require('path');

const dir = 'public';
const files = ['aktualnosci.html', 'fundacja.html', 'kontakt.html', 'o-mnie.html'];

const indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

const startMarker = '/* --- PREMIUM FOOTER REDESIGN --- */';
// In index.html, footer CSS ends before this:
const indexEndMarker = '/* --- PREMIUM COOKIE POPUP --- */';

const startIndex = indexHtml.indexOf(startMarker);
const endIndex = indexHtml.indexOf(indexEndMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find CSS markers in index.html");
    console.error("Start:", startIndex, "End:", endIndex);
    process.exit(1);
}

const cssContent = indexHtml.substring(startIndex, endIndex);

// Try multiple possible end markers for the target files
const possibleEndMarkers = [
    '/* --- PREMIUM COOKIE POPUP --- */',
    '/* --- COOKIE POPUP (Improved) --- */',
    '/* --- COOKIE POPUP --- */',
];

for (const file of files) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    const fileStartIndex = content.indexOf(startMarker);
    if (fileStartIndex === -1) {
        console.log(`Start marker not found in ${file}`);
        continue;
    }

    let fileEndIndex = -1;
    let usedMarker = '';
    for (const marker of possibleEndMarkers) {
        fileEndIndex = content.indexOf(marker);
        if (fileEndIndex !== -1) {
            usedMarker = marker;
            break;
        }
    }

    if (fileEndIndex === -1) {
        console.log(`End marker not found in ${file}`);
        continue;
    }
    
    content = content.substring(0, fileStartIndex) + cssContent + content.substring(fileEndIndex);
    fs.writeFileSync(filePath, content);
    console.log(`Updated footer CSS in ${file} (end marker: ${usedMarker})`);
}
