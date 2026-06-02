const fs = require('fs');
const path = require('path');

const dir = 'public';
const files = ['aktualnosci.html', 'fundacja.html', 'kontakt.html', 'o-mnie.html'];

const indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

const startMarker = '/* --- PREMIUM FOOTER REDESIGN --- */';
const endMarker = '/* --- PREMIUM COOKIE POPUP --- */';

const startIndex = indexHtml.indexOf(startMarker);
const endIndex = indexHtml.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find CSS markers in index.html");
    process.exit(1);
}

const cssContent = indexHtml.substring(startIndex, endIndex);

for (const file of files) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    const fileStartIndex = content.indexOf(startMarker);
    const fileEndIndex = content.indexOf(endMarker);
    
    if (fileStartIndex !== -1 && fileEndIndex !== -1) {
        content = content.substring(0, fileStartIndex) + cssContent + content.substring(fileEndIndex);
        fs.writeFileSync(filePath, content);
        console.log(`Updated footer CSS in ${file}`);
    } else {
        console.log(`CSS markers not found in ${file}`);
    }
}
