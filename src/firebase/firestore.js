// src/firebase/firestore.js

import {
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
  arrayRemove,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db as firestore } from "./config";    // use your exported `db = getFirestore(app)`
const storage = getStorage();

// ————— POSTS —————

const postsColl = collection(firestore, "posts");

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

export async function getPostById(id) {
  try {
    const snap = await getDoc(doc(firestore, "posts", id));
    if (!snap.exists()) return { success: false, error: "Post not found" };
    return { success: true, data: { id: snap.id, ...snap.data() } };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

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

export async function deletePost(id) {
  try {
    await deleteDoc(doc(firestore, "posts", id));
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

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

    const q    = query(postsColl, ...constraints);
    const snap = await getDocs(q);

    const posts          = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const newLastVisible = snap.docs[snap.docs.length - 1] || null;
    return { success: true, data: posts, lastVisible: newLastVisible };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ————— USERS —————

const usersColl = collection(firestore, "users");

export async function setUser(uid, userData) {
  try {
    const userRef = doc(firestore, "users", uid);
    const snap    = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid,
        ...userData,
        admin: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      });
    }

    return { success: true, id: uid };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getUserByUid(uid) {
  try {
    const snap = await getDoc(doc(firestore, "users", uid));
    if (!snap.exists()) return { success: false, error: "User not found" };
    return { success: true, data: { id: snap.id, ...snap.data() } };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function updateUser(uid, userData) {
  try {
    await updateDoc(doc(firestore, "users", uid), {
      ...userData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteUser(uid) {
  try {
    await deleteDoc(doc(firestore, "users", uid));
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getUsers() {
  try {
    const snap  = await getDocs(usersColl);
    const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return { success: true, data: users };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ...and so on for bookmarks, likes, comments, reports, audit logs, system health, role management, image uploads, etc.

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

// …rest of your exports unchanged…

export async function deleteImageByUrl(url) {
  try {
    const fileRef = storageRef(storage, url);
    await deleteObject(fileRef);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
