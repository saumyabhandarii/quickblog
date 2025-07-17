import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch blog and comments on load
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/blogs/${id}`);
        if (res.data.success) {
          setBlog(res.data.blog);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/blogs/${id}/comments`);
        if (res.data.success) {
          setComments(res.data.comments);
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    fetchBlog();
    fetchComments();
  }, [id, BASE_URL]);

  const handleCommentSubmit = async (e) => {
  e.preventDefault();
  if (!name.trim() || !content.trim()) return;

  try {
    setLoading(true);
    const res = await axios.post(`${BASE_URL}/api/blogs/add-comment`, {
    blogId: id,
    name,
    content, // ✅ correct key expected by backend
});




    if (res.data.success) {
      alert("Comment submitted for approval.");
      setName("");
      setContent("");
    } else {
      alert("Failed to submit comment");
    }
  } catch (err) {
    console.error("Submit comment error:", err);
    alert("An error occurred while submitting comment");
  } finally {
    setLoading(false);
  }
};


  if (error) {
    return <div className="text-center py-20 text-gray-500">Blog not found</div>;
  }

  if (!blog) {
    return <div className="text-center py-20 text-gray-400">Loading...</div>;
  }

  const imageUrl = blog.image?.startsWith("http")
    ? blog.image
    : `${BASE_URL}/uploads/${blog.image}`;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-100 via-white to-purple-50 py-16 px-4 text-center">
        <p className="text-sm text-purple-600">
          Published on {moment(blog.createdAt).format("MMMM Do YYYY")}
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4">
          {blog.title}
        </h1>
        <p className="text-lg text-gray-600 mt-2">{blog.subTitle}</p>
        <div className="mt-4 flex justify-center gap-3">
          <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
            {blog.category}
          </span>
          <span className="text-sm text-purple-500 underline">Author</span>
        </div>
      </div>

      {/* Image */}
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <img
          src={imageUrl}
          alt={blog.title}
          className="rounded-2xl w-full object-cover shadow-lg max-h-[500px]"
        />
      </div>

      {/* Blog Description */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h3 className="text-2xl font-semibold mb-4">Blog Description</h3>
        <div className="prose lg:prose-lg text-gray-800">
          {blog.description ? (
            <div dangerouslySetInnerHTML={{ __html: blog.description }} />
          ) : (
            <p className="text-gray-400 italic">
              No description provided for this blog.
            </p>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <h3 className="text-2xl font-bold mb-6">
          Comments ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <p className="text-gray-400 mb-6">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-4 mb-10">
            {comments.map((c, i) => (
              <div key={i} className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-gray-800">{c.name}</p>
                  <p className="text-sm text-gray-400">
                    {moment(c.createdAt).fromNow()}
                  </p>
                </div>
                <p className="text-gray-700">{c.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment Form */}
        <h4 className="text-xl font-semibold mb-4">Add your comment</h4>
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            rows="4"
            placeholder="Your Comment"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Comment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogDetail;
