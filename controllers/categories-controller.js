const Categories = require('../models/categories-model');

class CategoriesController { 
    async getAllCategories(req, res) {
        try {
            await Categories.getAllCategories(res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async getCategoryById(req, res) {
        try {
            await Categories.getCategoryById(req.params.categoryId, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async getPostsByCategory(req, res) {
        try {
            await Categories.getPostByCategory(req.params.categoryId, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async createCategory(req, res) {
        try {
            await Categories.createCategory(req.body, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }  

    async changeCategories(req, res) {
        try {
            await Categories.changeCategories(req.params.categoryId, req.body, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async deleteCategories(req, res) {
        try {
            const result = await Categories.deleteCategories(req.params.categoryId, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }
}

module.exports = new CategoriesController();