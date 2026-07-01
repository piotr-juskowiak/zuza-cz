const fs = require('fs');

let content = fs.readFileSync('public/aktualnosci.html', 'utf8');

// The string starts with:
//         <div class="news-list-premium">
// <style>
// /* Slider CSS */

const searchStr = '<div class="news-list-premium">\n<style>';
const replacementStr = '<style>';

content = content.replace(searchStr, replacementStr);

// Then lower down we have:
// <div class="news-list-premium">
//     <!-- Item 2: Nagrody -->

// This is correct, we want the slider to be BEFORE the <div class="news-list-premium">.
// But wait, since I removed the <div class="news-list-premium"> from the top, I now only have the second one opening correctly!
// Let's just do it cleanly:
// Find `<style>\n/* Slider CSS */`
// Insert `</div>` before it? No, because it was placed inside `<div class="container">` right after the closing `</div>` of `.news-filter`?
// Let's check exactly where it is.
fs.writeFileSync('public/aktualnosci.html', content);
console.log("Fixed opening tag");
