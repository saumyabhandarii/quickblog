import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const categories = ["All", "Technology", "Startup", "Lifestyle", "Finance"];

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [comments, setComments] = useState({}); // { blogId: { name: "", content: "" } }

  useEffect(() => {
    // Replace dummyBlogs with real API call if desired
    const dummyBlogs = [
      {
        _id: "1",
        title: "Mastering React in 2025",
        category: "Technology",
        image: "/uploads/blog_pic_1.png",
        content: "Learn React with modern patterns, suspense, and more!",
      },
      {
        _id: "2",
        title: "Startup Success Blueprint",
        category: "Startup",
        image: "/uploads/blog_pic_2.png",
        content: "Startups that thrived in 2025 share their secrets...",
      },
      {
        _id: "3",
        title: "Balancing Work and Life",
        category: "Lifestyle",
        image: "/uploads/blog_pic_3.png",
        content: "Tips to stay productive without burning out.",
      },
    ];
    setBlogs(dummyBlogs);
    setFilteredBlogs(dummyBlogs);
  }, []);

  useEffect(() => {
    let temp = blogs;
    if (activeCategory !== "All") {
      temp = temp.filter((blog) => blog.category === activeCategory);
    }
    if (searchTerm) {
      temp = temp.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredBlogs(temp);
  }, [searchTerm, activeCategory, blogs]);

  const handleCommentChange = (blogId, field, value) => {
    setComments((prev) => ({
      ...prev,
      [blogId]: { ...prev[blogId], [field]: value },
    }));
  };

  const addComment = async (e, blogId) => {
    e.preventDefault();
    const { name, content } = comments[blogId] || {};
    if (!name || !content) return;

    try {
      const { data } = await axios.post("/api/blogs/add-comment", {
        blog: blogId,
        name,
        content,
      });

      if (data.success) {
        toast.success(data.message);
        setComments((prev) => ({ ...prev, [blogId]: { name: "", content: "" } }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error submitting comment");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2">Explore Our Blogs</h1>
        <p className="text-gray-500">Search or filter by category to discover posts</p>
      </div>

      <div className="flex items-center gap-4 justify-center mb-8">
        <input
          type="text"
          placeholder="Search for blogs"
          className="border border-gray-300 px-4 py-2 rounded-md w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              activeCategory === cat
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">No blogs found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-xl shadow p-4">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-xl font-semibold mt-4">{blog.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{blog.category}</p>
              <p className="text-gray-700 mb-4">{blog.content}</p>

              {/* Comment form */}
              <form onSubmit={(e) => addComment(e, blog._id)} className="mt-4">
                <input
                  type="text"
                  value={comments[blog._id]?.name || ""}
                  onChange={(e) =>
                    handleCommentChange(blog._id, "name", e.target.value)
                  }
                  placeholder="Name"
                  className="w-full mb-2 px-3 py-1 border rounded"
                  required
                />
                <textarea
                  value={comments[blog._id]?.content || ""}
                  onChange={(e) =>
                    handleCommentChange(blog._id, "content", e.target.value)
                  }
                  placeholder="Comment"
                  className="w-full mb-2 px-3 py-1 border rounded"
                  rows="2"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-1 rounded-md"
                >
                  Submit
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
