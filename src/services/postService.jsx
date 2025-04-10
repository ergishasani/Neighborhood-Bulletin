// src/services/postService.jsx
import { db, auth } from '../firebase'; // Adjust path if your firebase.js is AT THE ROOT of src, otherwise './firebase' if it's in the same folder
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot, // For real-time updates
  // getDocs // Use this if you only want to fetch once, not real-time
} from 'firebase/firestore';

// --- Function to Create a New Post ---
export const createPost = async (text) => {
  // Get the currently logged-in user
  const user = auth.currentUser;
  if (!user) {
    console.error("No user logged in to create post.");
    // Maybe throw an error or return a specific status
    throw new Error("User must be logged in to post.");
  }

  try {
    // Reference the 'posts' collection
    const postsCollectionRef = collection(db, 'posts');

    // Add a new document to the 'posts' collection
    const docRef = await addDoc(postsCollectionRef, {
      text: text,                 // The content of the post
      userId: user.uid,           // The ID of the user who created it
      // Optional: Store user's display name if available (might need to fetch it)
      // userName: user.displayName || 'Anonymous',
      createdAt: serverTimestamp(), // Firebase server timestamp for ordering
      // Add any other fields you need, e.g., likes: 0, comments: []
    });
    console.log("Post created with ID: ", docRef.id);
    return docRef; // Return the document reference
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; // Re-throw the error to be handled by the calling component
  }
};

// --- Function to Get Posts with Real-time Updates ---
export const getPostsListener = (callback, errorCallback) => { // Added errorCallback
  // Create a query to get posts, ordered by 'createdAt' descending
  const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

  // Set up the real-time listener
  const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      // Add the document data along with its ID
      posts.push({ id: doc.id, ...doc.data() });
    });
    // Call the success callback function provided by the component
    callback(posts);
  }, (error) => {
      // Handle errors from the listener
      console.error("Error listening to posts collection: ", error);
      // Call the error callback function provided by the component
      if (errorCallback) {
        errorCallback(error);
      }
  });

  // Return the unsubscribe function so the component can clean up the listener
  return unsubscribe;
};

// --- (Alternative) Function to Get Posts Just Once ---
// export const getPostsOnce = async () => {
//   const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
//   try {
//     const querySnapshot = await getDocs(postsQuery);
//     const posts = [];
//     querySnapshot.forEach((doc) => {
//       posts.push({ id: doc.id, ...doc.data() });
//     });
//     return posts;
//   } catch (error) {
//     console.error("Error fetching posts: ", error);
//     throw error;
//   }
// };