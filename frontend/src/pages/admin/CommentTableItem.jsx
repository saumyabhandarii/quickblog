import React from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, name, content, _id, isApproved } = comment;
  const BlogDate = new Date(createdAt);
  const { axios } = useAppContext();

  const handleApprove = async () => {
    try {
      const res = await axios.put(`/api/admin/comment/${_id}/approve`);
      if (res.data.success) {
        toast.success(res.data.message || 'Comment approved');
        fetchComments();
      } else {
        toast.error(res.data.message || 'Failed to approve');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error approving comment');
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this comment?");
    if (!confirm) return;

    try {
      const res = await axios.delete(`/api/admin/comment/${_id}`);
      if (res.data.success) {
        toast.success('Comment deleted');
        fetchComments();
      } else {
        toast.error(res.data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting comment');
    }
  };

  return (
    <tr className='border-y border-gray-300'>
      <td className='px-6 py-4'>
        <b className='font-medium text-gray-600'>Blog</b>: {blog?.title || "Untitled"}
        <br /><br />
        <b className='font-medium text-gray-600'>Name</b>: {name}
        <br />
        <b className='font-medium text-gray-600'>Comment</b>: {content}
      </td>

      <td className='px-6 py-4 max-sm:hidden'>
        {BlogDate.toLocaleDateString()}
      </td>

      <td className='px-6 py-4'>
        <div className="flex items-center gap-3">
          {!isApproved ? (
            <img
              src={assets.tick_icon}
              alt="Approve"
              className='w-5 cursor-pointer hover:scale-110 transition-all'
              onClick={handleApprove}
            />
          ) : (
            <p className='text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1'>
              Approved
            </p>
          )}

          <img
            src={assets.bin_icon}
            alt="Delete"
            className='w-5 cursor-pointer hover:scale-110 transition-all'
            onClick={handleDelete}
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
