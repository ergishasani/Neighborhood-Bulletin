import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    serverTimestamp,
  } from "firebase/firestore";
  import { db } from "./config";
  import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
  
  // ================== POSTS ==================
  
  const postsCollection = collection(db, "posts");
  
  export const addPost = async (postData) => {
    try {
      const docRef = await addDoc(postsCollection, {
        ...postData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  export const getPostById = async (id) => {
    try {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: "No such document!" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  export const updatePost = async (id, postData) => {
    try {
      const docRef = doc(db, "posts", id);
      await updateDoc(docRef, {
        ...postData,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  export const deletePost = async (id) => {
    try {
      const docRef = doc(db, "posts", id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  export const getPosts = async (category = null, limitCount = 10, lastVisible = null) => {
    try {
      let q;
      if (category) {
        q = query(
          postsCollection,
          where("category", "==", category),
          orderBy("createdAt", "desc"),
          limit(limitCount)
        );
      } else if (lastVisible) {
        q = query(
          postsCollection,
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(limitCount)
        );
      } else {
        q = query(
          postsCollection,
          orderBy("createdAt", "desc"),
          limit(limitCount)
        );
      }
  
      const querySnapshot = await getDocs(q);
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
  
      const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      return { success: true, data: posts, lastVisible: newLastVisible };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  // ================== USERS ==================
  
  const usersCollection = collection(db, "users");
  
  export const addUser = async (userData) => {
    try {
      const docRef = await addDoc(usersCollection, {
        ...userData,
        createdAt: serverTimestamp(),
        role: "user",
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  export const getUserById = async (id) => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: "No such document!" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  export const getUsers = async () => {
    try {
      const snapshot = await getDocs(usersCollection);
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, data: users };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  export const updateUser = async (userId, userData) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  export const deleteUser = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  // ================== COMMENTS ==================
  
  export const addComment = async (postId, commentData) => {
    try {
      const commentsCollection = collection(db, "posts", postId, "comments");
      const docRef = await addDoc(commentsCollection, {
        ...commentData,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  export const getComments = async (postId) => {
    try {
      const commentsCollection = collection(db, "posts", postId, "comments");
      const q = query(commentsCollection, orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: comments };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  // ================== IMAGE UPLOAD ==================
  
  const storage = getStorage();
  
  export const uploadImage = async (file, path = "images/") => {
    try {
      const storageRef = ref(storage, `${path}${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (err) {
      throw new Error("Image upload failed: " + err.message);
    }
  };
  
  export const deleteImage = async (imageUrl) => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      return true;
    } catch (err) {
      throw new Error("Image deletion failed: " + err.message);
    }
  };
  