const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

// Helper function to read a file
const readFile = filePath => {
  return fs.readFileSync(filePath, 'utf-8');
};

// Helper function to write a file
const writeFile = (filePath, content) => {
  fs.writeFileSync(filePath, content, 'utf-8');
};

// Inject Android-specific code into createURL(to) function to make it work on Android
const injectAndroidCode = filePath => {
  let content = readFile(filePath);

  // Regular expression to find createURL function
  const createURLRegex =
    /function createURL\(to\) \{[\s\S]+?return new URL\(href, base\);\s+\}/;
  const match = content.match(createURLRegex);

  if (match) {
    const createURLFunction = match[0];

    // Code to inject
    const androidCode = `
    if (base.startsWith("content://")) {
      base = "file:///android_asset/";
    }
    `;

    // Inject the code before return statement
    const modifiedFunction = createURLFunction.replace(
      'return new URL(href, base);',
      `${androidCode}return new URL(href, base);`
    );

    // Replace the original function with the modified function
    content = content.replace(createURLFunction, modifiedFunction);

    // Write the modified content back to the file
    writeFile(filePath, content);
  } else {
    console.error('createURL function not found in the file.');
  }
};

// Function to embed all scripts in the bip39 folder into index.html
const embedScriptsIntoIndexHtml = (indexHtmlPath, scriptsDir) => {
  let indexHtml = readFile(indexHtmlPath);

  // Define the order of the scripts
  const scriptOrder = [
    'bip39-libs.js',
    'ripple-util.js',
    'jingtum-util.js',
    'casinocoin-util.js',
    'cosmos-util.js',
    'eos-util.js',
    'fio-util.js',
    'xwc-util.js',
    'sjcl-bip39.js',
    'wordlist_english.js',
    'wordlist_japanese.js',
    'wordlist_spanish.js',
    'wordlist_chinese_simplified.js',
    'wordlist_chinese_traditional.js',
    'wordlist_french.js',
    'wordlist_italian.js',
    'wordlist_korean.js',
    'wordlist_czech.js',
    'wordlist_portuguese.js',
    'jsbip39.js',
    'entropy.js',
    'monero.js',
    'sha3.js',
    'bitcoinjs-extensions.js',
    'segwit-parameters.js',
    'index.js',
  ];

  // Function to create script tags
  const createScriptTag = filePath =>
    `<script> /* ${path.basename(filePath)} */
    ${readFile(filePath)}\n
    </script>`;

  // Generate script tags for all scripts in the specified order
  const allScripts = scriptOrder
    .map(file => path.join(scriptsDir, file))
    .map(createScriptTag)
    .join('\n');

  // Inject scripts into the index.html (before the closing body tag)
  indexHtml = indexHtml.replace('</body>', `${allScripts}</body>`);

  // Write the modified index.html back to disk
  writeFile(indexHtmlPath, indexHtml);
};

// Main function
const main = () => {
  const distDir = path.resolve(__dirname, 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  const scriptsDir = path.join(distDir, 'bip39');

  // Embed scripts into index.html
  embedScriptsIntoIndexHtml(indexHtmlPath, scriptsDir);

  // Fix for android (TODO: Find if there is a better way)
  injectAndroidCode(indexHtmlPath);

  // Remove other files (except index.html)
  const filesToRemove = fs
    .readdirSync(distDir)
    .filter(file => file !== 'index.html');
  filesToRemove.forEach(file => {
    const filePath = path.join(distDir, file);
    if (fs.statSync(filePath).isDirectory()) {
      rimraf.sync(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  });

  console.log('Post-build processing complete.');
};

main();
