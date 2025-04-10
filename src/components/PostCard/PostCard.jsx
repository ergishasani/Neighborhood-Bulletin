// src/components/PostCard/PostCard.jsx

const PostCard = ({ post }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-gray-700">{post.description}</p>
        <p className="text-sm text-gray-500 mt-2">{post.createdAt?.toLocaleString()}</p>
      </div>
    );
  };
  
  export default PostCard;
  