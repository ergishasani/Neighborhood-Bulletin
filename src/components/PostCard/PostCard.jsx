import React from 'react';

const PostCard = ({ post }) => {
  const createdAt = post.createdAt?.toDate ? post.createdAt.toDate() : null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
      <p className="text-gray-700">{post.description}</p>

      {post.imageUrl && (
        <div className="mt-4">
          <img src={post.imageUrl} alt="Post Image" className="w-full h-auto rounded-md" />
        </div>
      )}

      <p className="text-sm text-gray-500 mt-2">
        {createdAt ? createdAt.toLocaleString() : 'Date not available'}
      </p>
    </div>
  );
};

export default PostCard;
