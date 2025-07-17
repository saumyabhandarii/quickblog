import express from 'express';
import { addComment, getBlogComments } from '../controllers/commentController.js';

const commentRouter = express.Router();

// @route   POST /api/comments/add
// @desc    Add a new comment to a blog
commentRouter.post('/add', addComment);

// @route   GET /api/comments/blog/:blogId
// @desc    Get comments for a specific blog
commentRouter.get('/blog/:blogId', getBlogComments);

export default commentRouter;
