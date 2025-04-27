// src/firebase/firestore.js

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { db } from "./config";

const firestore = getFirestore();
const storage = getStorage();

// ————— POSTS —————

const postsColl = collection(firestore, "posts");

/** Add a post, returns { success, id } */
export async function addPost(postData) {
  try {
    const docRef = await addDoc(postsColl, {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/** Get a single post by ID */
export async function getPostById(id) {
  try {
    const snap = await getDoc(doc(firestore, "posts", id));
    if (!snap.exists()) {
      return { success: false, error: "Post not found" };
    }
    return { success: true, data: { id: snap.id, ...snap.data() } };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/** Update a post */
export async function updatePost(id, postData) {
  try {
    await updateDoc(doc(firestore, "posts", id), {
      ...postData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/** Delete a post */
export async function deletePost(id) {
  try {
    await deleteDoc(doc(firestore, "posts", id));
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch posts with optional filtering and pagination.
 * @param {Object} options
 * @param {string|null} options.category
 * @param {string|null} options.authorId
 * @param {number} options.limitCount
 * @param {QueryDocumentSnapshot|null} options.lastVisible
 */
export async function getPosts({
                                 category = null,
                                 authorId = null,
                                 limitCount = 10,
                                 lastVisible = null,
                               } = {}) {
  try {
    const constraints = [];
    if (category)   constraints.push(where("category", "==", category));
    if (authorId)   constraints.push(where("authorId", "==", authorId));
    constraints.push(orderBy("createdAt", "desc"));
    if (lastVisible) constraints.push(startAfter(lastVisible));
    constraints.push(limit(limitCount));

    const q = query(postsColl, ...constraints);
    const snap = await getDocs(q);

    const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const newLastVisible = snap.docs[snap.docs.length - 1] || null;

    return { success: true, data: posts, lastVisible: newLastVisible };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ————— USERS —————

const usersColl = collection(firestore, "users");

/** Create or overwrite a user document at users/{uid} */
export async function setUser(uid, userData) {
  try {
    await setDoc(doc(firestore, "users", uid), {
      uid,
      ...userData,
      createdAt: serverTimestamp(),
      role: "user",
    });
    return { success: true, id: uid };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/** Get a user by their Auth UID (doc ID) */
export async function getUserByUid(uid) {
  try {
    const snap = await getDoc(doc(firestore, "users", uid));
    if (!snap.exists()) {
      return { success: false, error: "User not found" };
    }
    return { success: true, data: { id: snap.id, ...snap.data() } };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Merge-update a user document (users/{uid}).
 * Returns { success }.
 */
export async function updateUser(uid, userData) {
  try {
    await setDoc(
        doc(firestore, "users", uid),
        {
          ...userData,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/** Delete a user document */
export async function deleteUser(uid) {
  try {
    await deleteDoc(doc(firestore, "users", uid));
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/** List all users (admin purpose) */
export async function getUsers() {
  try {
    const snap = await getDocs(usersColl);
    const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return { success: true, data: users };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ————— BOOKMARKS —————

/**
 * Toggle a postId in the user's bookmarks array.
 * If `isBookmarked === true`, removes it; otherwise adds it.
 */
export async function toggleBookmark(userId, postId, isBookmarked) {
  try {
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, {
      bookmarks: isBookmarked
          ? arrayRemove(postId)
          : arrayUnion(postId),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/** Check if a postId is in the user's bookmarks */
export async function isBookmarked(userId, postId) {
  try {
    const res = await getUserByUid(userId);
    if (!res.success) return false;
    const bks = res.data.bookmarks;
    return Array.isArray(bks) && bks.includes(postId);
  } catch {
    return false;
  }
}

// ————— COMMENTS —————

export async function addComment(postId, commentData) {
  try {
    const commentsColl = collection(firestore, "posts", postId, "comments");
    const docRef = await addDoc(commentsColl, {
      ...commentData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getComments(postId) {
  try {
    const commentsColl = collection(firestore, "posts", postId, "comments");
    const q = query(commentsColl, orderBy("createdAt", "asc"));
    const snap = await getDocs(q);
    const comments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return { success: true, data: comments };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ————— IMAGE UPLOAD —————

export async function uploadImage(file, folder = "images/") {
  try {
    const fileRef = storageRef(storage, `${folder}${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return { success: true, url };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteImageByUrl(url) {
  try {
    const fileRef = storageRef(storage, url);
    await deleteObject(fileRef);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
