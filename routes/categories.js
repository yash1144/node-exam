const express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', optionalAuth, async (req, res) => {
    try {
        const categories = await Category.find()
            .populate('createdBy', 'username')
            .sort({ name: 1 });

        res.render('categoryList', { 
            categories, 
            user: req.user || null 
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Show category form (admin only)
router.get('/add', authenticateToken, requireAdmin, (req, res) => {
    res.render('categoryForm', { 
        category: null, 
        user: req.user 
    });
});

// Create new category (admin only)
router.post('/add', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = new Category({
            name,
            description,
            createdBy: req.user._id
        });

        await category.save();
        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Show edit category form (admin only)
router.get('/edit/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.render('categoryForm', { 
            category, 
            user: req.user 
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update category (admin only)
router.post('/edit/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if name already exists (excluding current category)
        const existingCategory = await Category.findOne({ 
            name, 
            _id: { $ne: req.params.id } 
        });
        
        if (existingCategory) {
            return res.status(400).json({ message: 'Category name already exists' });
        }

        category.name = name;
        category.description = description;

        await category.save();
        res.redirect('/categories');
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete category (admin only)
router.get('/delete/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if category is being used by any products
        const productsUsingCategory = await Product.findOne({ 
            category: req.params.id,
            isActive: true 
        });

        if (productsUsingCategory) {
            return res.status(400).json({ 
                message: 'Cannot delete category. It is being used by products.' 
            });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/categories');
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get products by category
router.get('/:id/products', optionalAuth, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const products = await Product.find({ 
            category: req.params.id,
            isActive: true 
        })
        .populate('category', 'name')
        .populate('createdBy', 'username')
        .sort({ createdAt: -1 });

        res.render('productList', { 
            products, 
            category,
            user: req.user || null 
        });
    } catch (error) {
        console.error('Error fetching category products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 