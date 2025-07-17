import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('Not Approved');
  const { axios } = useAppContext();

  const fetchComments = async () => {
    try {
      const response = await axios.get('/api/admin/comments');
      if (response.data.success) {
        setComments(response.data.comments);
      } else {
        toast.error(response.data.message || 'Failed to fetch comments');
      }
    } catch (error) {
      toast.error('Error fetching comments');
    }
  };

  const handleApprove = async (commentId) => {
    try {
      const res = await axios.put(`/api/admin/comment/${commentId}/approve`);
      if (res.data.success) {
        toast.success('Comment approved');
        fetchComments();
      } else {
        toast.error(res.data.message || 'Failed to approve');
      }
    } catch (err) {
      toast.error('Error approving comment');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await axios.delete(`/api/admin/comment/${commentId}`);
      if (res.data.success) {
        toast.success('Comment deleted');
        fetchComments();
      } else {
        toast.error(res.data.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Error deleting comment');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const filteredComments = comments.filter(
    (c) => (filter === 'Approved' ? c.isApproved : !c.isApproved)
  );

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Comments ({filter})</h1>
        <div className="space-x-2">
          {['Approved', 'Not Approved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1 rounded-full text-sm ${
                filter === status ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">BLOG & COMMENT</th>
              <th className="px-6 py-3 text-left">DATE</th>
              <th className="px-6 py-3 text-left">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No comments available.
                </td>
              </tr>
            ) : (
              filteredComments.map((comment) => (
                <tr key={comment._id} className="border-t">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{comment.blog?.title || 'Untitled Blog'}</p>
                    <p className="text-gray-700">{comment.content}</p>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {!comment.isApproved && (
                      <button
                        onClick={() => handleApprove(comment._id)}
                        className="text-green-600 hover:underline"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comments;
