// firestoreService.js
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase"; // make sure you export both db and auth in firebase.js

//--------------------------------
// 🔹 Firestore Services
//--------------------------------

// ✅ Add data
export const addData = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// ✅ Get all data
export const getAllData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (e) {
    console.error("Error getting documents: ", e);
  }
};

// ✅ Get single document
export const getDataById = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
  }
};

// ✅ Update document
export const updateData = async (collectionName, id, newData) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, newData);
    console.log("Document updated successfully");
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

// ✅ Delete document
export const deleteData = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    console.log("Document deleted successfully");
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

//--------------------------------
// 🔹 Firebase Auth Services
//--------------------------------

// ✅ Sign Up
export const handleSignUp = async (email, password, extraData = {}) => {
  try {
    console.log("Starting signup process...");
    console.log("Email:", email);
    
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("User created successfully:", user.uid);

    const userData = {
      uid: user.uid,
      email: user.email,
      createdAt: new Date().toISOString(),
      ...extraData, // merge additional data (e.g. name, phone, etc.)
    };

    console.log("Saving user data to Firestore...");
    await setDoc(doc(db, "users", user.uid), userData);

    console.log("User data saved successfully:", userData);

    return { success: true, data: userData };
  } catch (error) {
    console.error("Error signing up:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // Handle specific Firebase Auth errors
    let errorMessage = "An error occurred during sign up";
    
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email is already registered. Please login or use a different email.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address format.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak. Please use at least 6 characters.";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage = "Network error. Please check your internet connection.";
    } else if (error.code === "auth/operation-not-allowed") {
      errorMessage = "Email/password accounts are not enabled. Please contact support.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

// ✅ Login (like handleSignUp)
export const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userData = await getDataById("users", user.uid);
    if (!userData) {
      return { success: false, error: "User data not found in Firestore." };
    }
    return { success: true, data: userData };
  } catch (error) {
    console.error("Error logging in:", error);
    let errorMessage = "An error occurred during login";
    if (error.code === "auth/user-not-found") {
      errorMessage = "No user found with this email.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address format.";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage = "Network error. Please check your internet connection.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};

// ✅ Forgot Password
export const forgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent!");
  } catch (error) {
    console.error("Error sending reset email:", error.message);
    throw error;
  }
};

// ✅ Logout
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error.message);
    throw error;
  }
};




export const uploadImageToCloudinary = async (imageUri) => {
    const CLOUD_NAME = "drrr99dz9";
    const UPLOAD_PRESET = "react_native_uploads";


    try {
       

        let data = new FormData();
        data.append("file", {
            uri: imageUri,
            type: "image/jpeg",
            name: "upload.jpg",
        });
        data.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: data,
            }
        );

        const result = await res.json();

        return result.secure_url; // 🔥 Cloudinary hosted URL
    } catch (err) {
        console.error("Cloudinary upload failed", err);
        throw err;
    }
};
