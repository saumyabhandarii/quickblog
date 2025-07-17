import express from "express";
import {
  addBlog,
  addComment,
  deleteUserBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  toggleUserBlogPublish,
  updateBlog,
} from "../controllers/blogController.js";

import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

// Public - Get all blogs
blogRouter.get("/", getAllBlogs);

// 🔥 Move this ABOVE dynamic ":id" route to prevent conflict
blogRouter.post("/generate", auth, generateContent); // ✅ Corrected position

// Public - Get single blog
blogRouter.get("/:id", getBlogById);

// Public - Get approved comments for a blog
blogRouter.get("/:blogId/comments", getBlogComments);

// Public - Add a comment
blogRouter.post("/add-comment", addComment);

// Authenticated - Add new blog
blogRouter.post("/add", auth, upload.single("image"), addBlog);

// Authenticated - Update / Delete / Toggle publish
blogRouter.post("/delete", auth, deleteUserBlogById);
blogRouter.post("/toggle-publish", auth, toggleUserBlogPublish);
blogRouter.post("/update", auth, updateBlog);

export default blogRouter;
