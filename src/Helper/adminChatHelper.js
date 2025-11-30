import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  collectionGroup,
} from "firebase/firestore";
import { db } from "../../firebase";

/**
 * Debug function to check what collections exist in Firestore
 */
export const debugFirestoreCollections = async () => {
  try {
    console.log("🔧 DEBUG: Checking Firestore connection...");
    console.log("🔧 DB instance:", db);
    
    // Try to get all documents from 'messages' collection
    const messagesRef = collection(db, "messages");
    console.log("🔧 Messages reference created:", messagesRef);
    
    const snapshot = await getDocs(messagesRef);
    console.log("✅ Firestore connection OK");
    console.log(`📊 Messages collection has ${snapshot.docs.length} documents`);
    
    if (snapshot.docs.length > 0) {
      console.log("📋 Chat documents:");
      snapshot.docs.forEach((doc) => {
        console.log(`   - ${doc.id}`);
        console.log(`     Data:`, doc.data());
      });
    } else {
      console.log("⚠️ WARNING: Messages collection is empty or not accessible!");
    }
    
    return snapshot.docs.length;
  } catch (error) {
    console.error("❌ Error accessing Firestore:", error);
    console.error("❌ Error details:", error.message);
    return 0;
  }
};

/**
 * Fetch all admin chats
 * Chat document IDs are userId (unique per user)
 * @returns {Promise<Array>} Array of chat conversations
 */
export const fetchAdminChats = async () => {
  try {
    console.log("🔍 Fetching all admin chats");

    // Fetch ALL chats from the adminChats collection
    const adminChatsRef = collection(db, "adminChats");
    const snapshot = await getDocs(adminChatsRef);

    console.log("📊 Total admin chats fetched from database:", snapshot.docs.length);

    const adminChats = [];

    // Process all chats
    for (const doc of snapshot.docs) {
      const chatId = doc.id;
      const chatData = doc.data();
      const userId = chatData.userId || chatId; // Use chatId as userId if not in data
      
      // Get last message
      const lastMessage = await getLastAdminChatMessage(chatId);

      adminChats.push({
        autoDocId: chatId, // Store the document ID for Firestore operations
        chatId, // The chatId (same as userId)
        userId: userId, // The user ID
        lastMessage: lastMessage?.text || "",
        lastMessageTime: lastMessage?.createdAt || chatData.updatedAt || null,
        senderId: lastMessage?.senderId || null,
        ...chatData,
      });
    }

    // Sort by last message time (newest first)
    adminChats.sort((a, b) => {
      const timeA = a.lastMessageTime
        ? new Date(a.lastMessageTime).getTime()
        : 0;
      const timeB = b.lastMessageTime
        ? new Date(b.lastMessageTime).getTime()
        : 0;
      return timeB - timeA;
    });

    console.log("✨ Final admin chats found:", adminChats.length);

    return adminChats;
  } catch (error) {
    console.error("Error fetching admin chats:", error);
    return [];
  }
};

/**
 * Get all messages from a specific chat
 * @param {string} chatId - The chat document ID
 * @returns {Promise<Array>} Array of message objects
 */
export const getChatMessages = async (chatId) => {
  try {
    const messagesRef = collection(db, "adminChats", chatId, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

    const snapshot = await getDocs(messagesQuery);

    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return messages;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return [];
  }
};

/**
 * Get the last message from a chat's messages subcollection
 * @param {string} chatId - The chat document ID
 * @returns {Promise<Object|null>} Last message object or null
 */
export const getLastAdminChatMessage = async (chatId) => {
  try {
    const messagesRef = collection(db, "adminChats", chatId, "messages");
    const messagesQuery = query(
      messagesRef,
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(messagesQuery);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching last message:", error);
    return null;
  }
};

/**
 * Subscribe to real-time updates of admin chats
 * @param {Function} callback - Function to call when chats update
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAdminChats = (callback) => {
  try {
    const adminChatsRef = collection(db, "adminChats");

    // Subscribe to adminChats collection
    const unsubscribe = onSnapshot(
      adminChatsRef,
      async (snapshot) => {
        const adminChats = [];

        for (const doc of snapshot.docs) {
          const chatId = doc.id;
          const chatData = doc.data();
          const userId = chatData.userId || chatId; // Use chatId as userId if not in data

          const lastMessage = await getLastAdminChatMessage(chatId);

          adminChats.push({
            autoDocId: chatId,
            chatId,
            userId: userId,
            lastMessage: lastMessage?.text || "",
            lastMessageTime: lastMessage?.createdAt || chatData.updatedAt || null,
            senderId: lastMessage?.senderId || null,
            ...chatData,
          });
        }

        // Sort by last message time
        adminChats.sort((a, b) => {
          const timeA = a.lastMessageTime
            ? new Date(a.lastMessageTime).getTime()
            : 0;
          const timeB = b.lastMessageTime
            ? new Date(b.lastMessageTime).getTime()
            : 0;
          return timeB - timeA;
        });

        callback(adminChats);
      },
      (error) => {
        console.error("Error subscribing to admin chats:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error in subscribeToAdminChats:", error);
    return () => {};
  }
};

/**
 * Subscribe to real-time updates of messages in a specific chat
 * @param {string} chatId - The chat document ID
 * @param {Function} callback - Function to call when messages update
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAdminChatMessages = (chatId, callback) => {
  try {
    if (!chatId) {
      console.warn("subscribeToAdminChatMessages: chatId is required");
      return () => {};
    }

    const messagesRef = collection(db, "adminChats", chatId, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        callback(messages);
      },
      (error) => {
        console.error("Error subscribing to messages:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error in subscribeToAdminChatMessages:", error);
    return () => {};
  }
};

/**
 * Format timestamp for display
 * @param {Object} timestamp - Firebase timestamp object
 * @returns {string} Formatted time string
 */
export const formatAdminChatTime = (timestamp) => {
  if (!timestamp) return "";

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error formatting admin chat time:", error);
    return "";
  }
};
