import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BlogEditModal = ({ blog, onClose, onSave }) => {
  const [title, setTitle] = useState(blog.title);
  const [subTitle, setSubTitle] = useState(blog.subTitle || '');

  const handleSave = async () => {
    try {
      await axios.post('/api/blog/update', {
        id: blog._id,
        updates: {
          title,
          subTitle
        }
      });
      toast.success("Blog updated successfully!");
      onSave(); // refresh blog list
      onClose(); // close modal
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update blog");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Blog</h2>

        <label className="block mb-1 text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-1 text-sm font-medium">Subtitle</label>
        <input
          type="text"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogEditModal;
