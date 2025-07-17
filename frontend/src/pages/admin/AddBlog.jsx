import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import { marked } from 'marked';

const AddBlog = () => {
  const { axios } = useAppContext();

  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Start Up');
  const [publishNow, setPublishNow] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);

  const generateContent = async () => {
    if (!title) return toast.error('Please enter a title');

    try {
      setLoading(true);
      const { data } = await axios.post('/api/blogs/generate', { prompt: title });

      if (data.success) {
        const html = marked(data.content || '');
        setDescription(data.content); // Update actual textarea
        if (editorRef.current) {
          editorRef.current.innerHTML = html; // Update preview
        }
      } else {
        toast.error(data.message || 'Failed to generate content');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnail(file);
    } else {
      toast.error('Please select a valid image file.');
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!thumbnail) return toast.error('Thumbnail is required.');

    setIsAdding(true);

    try {
      const blog = {
        title,
        subTitle: subtitle,
        description,
        category,
        isPublished: publishNow,
      };

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog));
      formData.append('image', thumbnail);

      const { data } = await axios.post('/api/blogs/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        toast.success(data.message || 'Blog created successfully!');
        // Reset form
        setThumbnail(null);
        setTitle('');
        setSubtitle('');
        setDescription('');
        setCategory('Start Up');
        setPublishNow(false);
        if (editorRef.current) editorRef.current.innerHTML = '';
      } else {
        toast.error(data.message || 'Failed to create blog');
      }
    } catch (error) {
      console.error('Blog add failed:', error);
      toast.error(error.response?.data?.message || 'An error occurred while adding the blog');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className='p-6 md:p-10 bg-[#F9FBFC] min-h-screen'>
      <form
        onSubmit={onSubmitHandler}
        className='w-full bg-white p-10 rounded-xl shadow space-y-8'
      >
        <h2 className='text-3xl font-semibold text-gray-800 mb-6'>Add New Blog</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Thumbnail Upload */}
          <div className='col-span-1'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Upload thumbnail</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleThumbnailChange}
              className='border p-2 w-full rounded text-sm bg-gray-50'
              required
            />
            {thumbnail && (
              <div className='mt-2'>
                <p className='text-sm text-gray-600 mb-1'>Preview:</p>
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt='Thumbnail Preview'
                  className='h-32 w-auto rounded border'
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div className='col-span-1'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Blog title</label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full border rounded p-3 text-sm'
              placeholder='Type here'
              required
            />
          </div>

          {/* Subtitle */}
          <div className='col-span-1'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Sub title</label>
            <input
              type='text'
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className='w-full border rounded p-3 text-sm'
              placeholder='Type here'
            />
          </div>

          {/* Description */}
          <div className='col-span-1 md:col-span-3'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Blog description</label>
            <textarea
              rows='6'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full border rounded p-3 text-sm'
              placeholder='Write the blog content here...'
              required
            ></textarea>

            <p className='mt-4'>Blog Description Preview</p>
            <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
              <div ref={editorRef} className='prose max-w-none'></div>

              {loading && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/10 mt-2'>
                  <div className='w-8 h-8 rounded-full border-2 border-t-white animate-spin'></div>
                </div>
              )}

              <button
                disabled={loading}
                type='button'
                onClick={generateContent}
                className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer'
              >
                {loading ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
          </div>

          {/* Category */}
          <div className='col-span-1'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Blog category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full border rounded p-3 text-sm bg-white'
            >
              <option>Start Up</option>
              <option>Technology</option>
              <option>Marketing</option>
              <option>Health</option>
            </select>
          </div>

          {/* Publish Now */}
          <div className='col-span-1 flex items-center pt-7'>
            <input
              type='checkbox'
              checked={publishNow}
              onChange={() => setPublishNow(!publishNow)}
              className='mr-2'
            />
            <label className='text-sm font-medium text-gray-700'>Publish Now</label>
          </div>
        </div>

        {/* Submit Button */}
        <div className='mt-4'>
          <button
            type='submit'
            disabled={isAdding}
            className='bg-primary text-white px-6 py-3 rounded-md hover:bg-purple-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isAdding ? 'Adding...' : 'Add Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
