import express from "express";
import {
  adminLogin,
  getDashboardStats,
  getDashboardData, // ✅ added
  getAllComments,
  approveCommentById,
  deleteCommentById,
  getAllBlogsAdmin,
  createBlog,
  deleteBlogById,
  togglePublishStatus,
} from "../controllers/adminController.js";

import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const adminRouter = express.Router();

/* 
  ┌────────────────────────┐
  │      Auth Routes       │
  └────────────────────────┘ 
*/
adminRouter.post("/login", adminLogin);

/* 
  ┌────────────────────────┐
  │     Dashboard Routes   │
  └────────────────────────┘ 
*/
// ✅ Old (optional): You can keep this if other pages need only stats
adminRouter.get("/dashboard-stats", auth, getDashboardStats);

// ✅ NEW: Used by frontend Dashboard.jsx to fetch blogs, comments, drafts, recentBlogs
adminRouter.get("/dashboard", auth, getDashboardData);

/* 
  ┌────────────────────────┐
  │     Comment Routes     │
  └────────────────────────┘ 
*/
adminRouter.get("/comments", auth, getAllComments);
adminRouter.put("/comment/:id/approve", auth, approveCommentById);
adminRouter.delete("/comment/:id", auth, deleteCommentById);

/* 
  ┌────────────────────────┐
  │      Blog Routes       │
  └────────────────────────┘ 
*/
adminRouter.get("/blogs", auth, getAllBlogsAdmin); // For Admin ListBlog
adminRouter.post("/create-blog", auth, upload.single("image"), createBlog);
adminRouter.delete("/blog/:id", auth, deleteBlogById);
adminRouter.put("/blog/:id/toggle", auth, togglePublishStatus); // Toggle publish status

export default adminRouter;
