import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Create a new blog
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file?.filename || null;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const blog = new Blog({ title, content, image, isPublished: false });
    await blog.save();

    res.status(201).json({ success: true, message: "Blog created", blog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating blog" });
  }
};

// ✅ Toggle blog published/unpublished
export const togglePublishStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.status(200).json({
      success: true,
      message: `Blog has been ${blog.isPublished ? "published" : "unpublished"}`,
      blog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to toggle publish status" });
  }
};


// ✅ Delete blog
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Blog.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting blog" });
  }
};

// ✅ Get all blogs
export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching blogs" });
  }
};

// ✅ Get all comments
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching comments" });
  }
};

// ✅ Get only pending comments
export const getPendingComments = async (req, res) => {
  try {
    const comments = await Comment.find({ isApproved: false });
    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching pending comments" });
  }
};

// ✅ Approve comment
export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    comment.isApproved = true;
    await comment.save();

    res.status(200).json({ success: true, message: "Comment approved", comment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error approving comment" });
  }
};

// ✅ Delete comment
export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Comment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting comment" });
  }
};

// ✅ Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const totalDrafts = await Blog.countDocuments({ isPublished: false });
    const totalComments = await Comment.countDocuments();
    const pendingComments = await Comment.countDocuments({ isApproved: false });

    res.status(200).json({
      success: true,
      stats: {
        totalBlogs,
        totalDrafts,
        totalComments,
        pendingComments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching dashboard stats" });
  }
};

// ✅ Proper dashboard endpoint used by Dashboard.jsx
export const getDashboardData = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    const comments = await Comment.find({ isApproved: true });

    const drafts = blogs.filter(blog => !blog.isPublished);
    const recentBlogs = blogs.slice(0, 5); // latest 5 blogs only

    res.status(200).json({
      success: true,
      blogs: blogs.length,
      comments: comments.length,
      drafts: drafts.length,
      recentBlogs,
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error.message);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard" });
  }
};

