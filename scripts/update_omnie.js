const fs = require('fs');
const indexContent = fs.readFileSync('public/index.html', 'utf8');
const omnieContent = fs.readFileSync('public/o-mnie.html', 'utf8');

const indexLines = indexContent.split('\n');

// Extract CSS lines 5258 to 5726 (1-indexed -> 5257 to 5725 in 0-indexed)
const cssLines = indexLines.slice(5257, 5726);

// Extract HTML lines 6120 to 6202 (1-indexed -> 6119 to 6202 in 0-indexed)
const htmlLines = indexLines.slice(6119, 6202);

// Make sure the CSS is wrapped in <style>
const blockToInsert = [
    '<style>',
    ...cssLines,
    '</style>',
    '',
    ...htmlLines
].join('\n');

// Find insertion point in o-mnie.html
// We want to insert after the end of #premium-about section.
const insertionMarker = `        </div>
    </div>
</section>`;

if (omnieContent.includes(insertionMarker)) {
    const newOmnie = omnieContent.replace(insertionMarker, insertionMarker + '\n\n' + blockToInsert);
    fs.writeFileSync('public/o-mnie.html', newOmnie);
    console.log("Successfully updated o-mnie.html");
} else {
    console.log("Could not find insertion marker.");
}
