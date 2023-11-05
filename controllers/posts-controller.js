const Post = require('../models/posts-model');
const Like = require('../models/likes-model');
const Comment = require('../models/comments-model');

class PostController {
    async createPost(req, res) {
        try {
            await Post.createPost(req.user.login, req.user.id, req.body, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async getAllPosts(req, res) {
        try {
            let page = req.query.page ? Number(req.query.page) : 1;
            await Post.getAllPost(page, req.query.category, req.query.date, req.query.sort, req.query.search, req.isAdmin, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async getPostById(req, res) {
        try {
            await Post.getPostById(req.params.postId, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async getPostCategories(req, res) {
        try {
            await Post.getPostCategories(req.params.postId, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async getPostLikes(req, res) {
        try {
            await Like.getLikes(req.params.postId, 'post', res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async setLike(req, res) {
        try {
            await Like.setLike(req.params.postId, req.user.login, false, 'post', res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async setDislike(req, res) {
        try {
            await Like.setLike(req.params.postId, req.user.login, true, 'post', res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async deleteLike(req, res) {
        try {
            await Like.deleteLike(req.params.postId, req.user.login, 'post', res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async changePost(req, res) {
        try {
            await Post.changePost(req.params.postId, req.user.login, req.user.roles, req.body, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async deletePost(req, res) {
        try {
            await Post.deletePost(req.params.postId, req.user.login, req.user.roles, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async addComment(req, res) {
        try {
            await Comment.createComment(req.params.postId, req.user.id, req.body, req.user.login, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async showComments(req, res) {
        try {
            await Comment.getAllComments(req.params.postId, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }
}

module.exports = new PostController();