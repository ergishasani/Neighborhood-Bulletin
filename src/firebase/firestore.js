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
  arrayRemove,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db as _db } from "./config";    // ensure you export `db = getFirestore()` from config
const firestore = getFirestore();
const storage   = getStorage();

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
                                 category    = null,
                                 authorId    = null,
                                 limitCount  = 10,
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

    const posts         = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const newLastVisible = snap.docs[snap.docs.length - 1] || null;
    return { success: true, data: posts, lastVisible: newLastVisible };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ————— USERS —————

const usersColl = collection(firestore, "users");

/**
 * Create or upsert a user document at /users/{uid}.
 * On first creation, sets admin:false and createdAt.
 * On subsequent calls, merges only updated fields.
 */
export async function setUser(uid, userData) {
  try {
    const userRef = doc(firestore, "users", uid);
    const snap    = await getDoc(userRef);

    if (!snap.exists()) {
      // first-time
      await setDoc(userRef, {
        uid,
        ...userData,
        admin: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      // existing: merge
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

// ————— BOOKMARKS —————

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

export async function isBookmarked(userId, postId) {
  try {
    const res = await getUserByUid(userId);
    if (!res.success) return false;
    return Array.isArray(res.data.bookmarks)
        && res.data.bookmarks.includes(postId);
  } catch {
    return false;
  }
}

// ————— LIKES —————

export async function toggleLike(postId, userId, isLiked) {
  try {
    const postRef = doc(firestore, "posts", postId);
    await updateDoc(postRef, {
      likes: isLiked
          ? arrayRemove(userId)
          : arrayUnion(userId),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function isLiked(postId, userId) {
  try {
    const res = await getPostById(postId);
    if (!res.success) return false;
    return Array.isArray(res.data.likes)
        && res.data.likes.includes(userId);
  } catch {
    return false;
  }
}

// ————— COMMENTS —————

export async function addComment(postId, commentData) {
  try {
    const commentsColl = collection(firestore, "posts", postId, "comments");
    const docRef       = await addDoc(commentsColl, {
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
    const q            = query(commentsColl, orderBy("createdAt", "asc"));
    const snap         = await getDocs(q);
    const comments     = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return { success: true, data: comments };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ————— REPORTS —————

export async function getReports({ limitCount = 50 } = {}) {
  try {
    const q    = query(
        collection(firestore, "reports"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
    );
    const snap = await getDocs(q);
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ————— AUDIT LOGS —————

export async function fetchAuditLogs({ limitCount = 50 } = {}) {
  try {
    const q    = query(
        collection(firestore, "auditLogs"),
        orderBy("timestamp", "desc"),
        limit(limitCount)
    );
    const snap = await getDocs(q);
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ————— SYSTEM HEALTH —————

export async function fetchSystemHealth() {
  try {
    const snap = await getDoc(doc(firestore, "systemHealth", "status"));
    if (!snap.exists()) throw new Error("Health status not found");
    return { success: true, data: snap.data() };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ————— ROLE MANAGEMENT —————

/**
 * Flip the `admin` flag on a user doc and log the action.
 */
export async function toggleUserRole(uid, makeAdmin) {
  try {
    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, { admin: makeAdmin });

    // write an audit log entry
    await addDoc(collection(firestore, "auditLogs"), {
      action:    makeAdmin ? "GRANT_ADMIN" : "REVOKE_ADMIN",
      targetUid: uid,
      timestamp: serverTimestamp(),
    });

    return { success: true };
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
