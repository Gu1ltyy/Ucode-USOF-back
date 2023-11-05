const Comment = require('../models/comments-model');
const Like = require('../models/likes-model');

class CommentController {
    async getCommentById(req, res) {
        try {
            await Comment.getCommentById(req.params.commentId, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async getAllLikes(req, res) {
        try {
            await Like.getLikes(req.params.commentId, 'comment', res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async setLike(req, res) {
        try {
            await Like.setLike(req.params.commentId, req.user.login, false, 'comment', res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async setDislike(req, res) {
        try {
            await Like.setLike(req.params.commentId, req.user.login, true, 'comment', res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async changeComment(req, res) {
        try {
            await Comment.changeComment(req.params.commentId, req.body, req.user.roles, req.user.login, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async deleteComment(req, res) {
        try {
            await Comment.deleteComment(req.params.commentId, req.user.login, req.user.roles, res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }

    async deleteLike(req, res) {
        try {
            await Like.deleteLike(req.params.commentId, req.user.login, 'comment', res);
        } catch (error) {
            res.status(500).json('Internal Server Error');
        }
    }
}

module.exports = new CommentController();