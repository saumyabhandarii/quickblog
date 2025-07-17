import fs from 'fs';
import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import imagekit from '../config/imageKit.js'; 


// ✅ Import main() used in generateContent
import { main as generateFromGemini } from '../config/gemini.js';
 // ✅ Adjust this path based on your project

// ✅ Add Blog with ImageKit Upload
export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: 'auto' },
        { format: 'webp' },
        { width: '1280' }
      ]
    });

    const newBlog = await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: optimizedImageUrl,
      isPublished,
    });

    res.status(201).json({
      success: true,
      message: "Blog added successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Add Blog Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Single Blog
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Blog and its Comments
export const deleteUserBlogById = async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blog: id });

    res.status(200).json({ success: true, message: 'Blog and related comments deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Toggle Publish Status
export const toggleUserBlogPublish = async (req, res) => {
  try {
    const { id } = req.body;

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
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { id, updates } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Add Comment
export const addComment = async (req, res) => {
  try {
    const { blogId, name, content } = req.body;

    if (!blogId || !name || !content) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    await Comment.create({
      blog: blogId,
      name,
      content,
      isApproved: false,
    });

    res.status(200).json({ success: true, message: "Comment submitted for approval." });
  } catch (error) {
    console.error("Add Comment Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Approved Comments
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const content = await generateFromGemini(
      `${prompt}. Generate a blog post based on the topic in simple text format.`
    );

    res.json({ success: true, content });
  } catch (error) {
    console.error("GenerateContent Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
