const fs = require('fs');
const path = require('path');

const dir = 'public';
const files = ['aktualnosci.html', 'fundacja.html', 'kontakt.html', 'o-mnie.html'];

const indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

const footerStart = '<!-- MODERN MEGA FOOTER -->';
const footerEnd = '</footer>';

const startIndex = indexHtml.indexOf(footerStart);
const endIndex = indexHtml.indexOf(footerEnd, startIndex) + footerEnd.length;

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find footer in index.html");
    process.exit(1);
}

const footerContent = indexHtml.substring(startIndex, endIndex);

for (const file of files) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    const fileStartIndex = content.indexOf(footerStart);
    const fileEndIndex = content.indexOf(footerEnd, fileStartIndex) + footerEnd.length;
    
    if (fileStartIndex !== -1 && fileEndIndex !== -1) {
        content = content.substring(0, fileStartIndex) + footerContent + content.substring(fileEndIndex);
        fs.writeFileSync(filePath, content);
        console.log(`Updated footer in ${file}`);
    } else {
        console.log(`Footer not found in ${file}`);
    }
}
