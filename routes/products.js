const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: 'File upload error: ' + error.message });
    } else if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
};

// Get all products (with optional authentication)
router.get('/', optionalAuth, async (req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .populate('category', 'name')
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });

        res.render('productList', { 
            products, 
            user: req.user || null 
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's own products
router.get('/my-products', authenticateToken, async (req, res) => {
    try {
        const products = await Product.find({ 
            createdBy: req.user._id,
            isActive: true 
        })
        .populate('category', 'name')
        .sort({ createdAt: -1 });

        res.render('myProducts', { 
            products, 
            user: req.user 
        });
    } catch (error) {
        console.error('Error fetching user products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Show product form
router.get('/add', authenticateToken, async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.render('productForm', { 
            product: null, 
            categories, 
            user: req.user 
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new product
router.post('/add', authenticateToken, upload.single('productImage'), handleMulterError, async (req, res) => {
    try {
        const { name, description, price, category, imageUrl, stock } = req.body;
        
        // Determine image URL - uploaded file takes priority over URL
        let finalImageUrl = '';
        if (req.file) {
            finalImageUrl = `/uploads/${req.file.filename}`;
        } else if (imageUrl) {
            finalImageUrl = imageUrl;
        }

        const product = new Product({
            name,
            description,
            price: parseFloat(price),
            category,
            imageUrl: finalImageUrl,
            stock: parseInt(stock) || 0,
            createdBy: req.user._id
        });

        await product.save();
        res.redirect('/products/my-products');
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Show edit product form
router.get('/edit/:id', authenticateToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user owns the product or is admin
        if (product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const categories = await Category.find().sort({ name: 1 });
        
        res.render('productForm', { 
            product, 
            categories, 
            user: req.user 
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update product
router.post('/edit/:id', authenticateToken, upload.single('productImage'), handleMulterError, async (req, res) => {
    try {
        const { name, description, price, category, imageUrl, stock } = req.body;
        
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user owns the product or is admin
        if (product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Determine image URL - uploaded file takes priority over URL
        let finalImageUrl = product.imageUrl; // Keep existing image by default
        if (req.file) {
            finalImageUrl = `/uploads/${req.file.filename}`;
        } else if (imageUrl) {
            finalImageUrl = imageUrl;
        }

        product.name = name;
        product.description = description;
        product.price = parseFloat(price);
        product.category = category;
        product.imageUrl = finalImageUrl;
        product.stock = parseInt(stock) || 0;

        await product.save();
        res.redirect('/products/my-products');
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product
router.get('/delete/:id', authenticateToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user owns the product or is admin
        if (product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Soft delete by setting isActive to false
        product.isActive = false;
        await product.save();

        res.redirect('/products/my-products');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// View single product
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .populate('createdBy', 'username');

        if (!product || !product.isActive) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.render('productItem', { 
            product, 
            user: req.user || null 
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 