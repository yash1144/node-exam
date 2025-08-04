const fs = require('fs');
const path = require('path');

// Files to check
const filesToCheck = [
    'server.js',
    'routes/auth.js',
    'routes/products.js',
    'routes/categories.js',
    'middleware/auth.js',
    'middleware/upload.js',
    'models/User.js',
    'models/Product.js',
    'models/Category.js'
];

console.log('🔍 Checking for syntax errors...\n');

filesToCheck.forEach(file => {
    try {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            // Try to require the file to check for syntax errors
            require(filePath);
            console.log(`✅ ${file} - No syntax errors`);
        } else {
            console.log(`❌ ${file} - File not found`);
        }
    } catch (error) {
        console.log(`❌ ${file} - Syntax error: ${error.message}`);
    }
});

console.log('\n🎉 Error checking complete!'); 