import { format } from 'date-fns';

const PostCard = ({ post }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4 flex flex-col h-full border border-gray-100">
      <div className="text-sm text-gray-500 mb-2">
        {post.neighborhood} • {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
      {post.createdAt && (
        <div className="text-xs text-gray-400 mt-auto">
          Posted on {format(post.createdAt, 'PPpp')}
        </div>
      )}
    </div>
  );
};

export default PostCard;
