import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BlogEditModal = ({ blog, onClose, onSave }) => {
  const [title, setTitle] = useState(blog.title || '');
  const [subTitle, setSubTitle] = useState(blog.subTitle || '');
  const titleInputRef = useRef(null);

  useEffect(() => {
    titleInputRef.current?.focus();

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target.id === 'modal-backdrop') {
      onClose();
    }
  };

  const handleSave = async () => {
    try {
      await axios.post('/api/blog/update', {
        id: blog._id,
        updates: {
          title,
          subTitle,
        },
      });
      toast.success("Blog updated!");
      onSave();  // Refresh blog list
      onClose(); // Close the modal
    } catch (err) {
      toast.error("Update failed");
      console.error("Update error:", err);
    }
  };

  return (
    <div
      id="modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Blog</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
        <input
          ref={titleInputRef}
          type="text"
          className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Subtitle</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogEditModal;
