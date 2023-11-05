const { Router } = require('express');
const router = Router();
const path = require('path');
const express = require('express');

const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const postsRouter = require('./postsRouter');
const categoriesRouter = require('./categoriesRouter');
const commentsRouter = require('./commentsRouter');

router.use('/api/auth', authRouter);
router.use('/api/users', userRouter);
router.use('/api/posts', postsRouter);
router.use('/api/categories', categoriesRouter);
router.use('/api/comments', commentsRouter);

module.exports = router;