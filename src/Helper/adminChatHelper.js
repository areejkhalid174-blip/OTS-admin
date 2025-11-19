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
    
    // Try to get all documents from 'chats' collection
    const chatsRef = collection(db, "chats");
    console.log("🔧 Chats reference created:", chatsRef);
    
    const snapshot = await getDocs(chatsRef);
    console.log("✅ Firestore connection OK");
    console.log(`📊 Chats collection has ${snapshot.docs.length} documents`);
    
    if (snapshot.docs.length > 0) {
      console.log("📋 Chat documents:");
      snapshot.docs.forEach((doc) => {
        console.log(`   - ${doc.id}`);
        console.log(`     Data:`, doc.data());
      });
    } else {
      console.log("⚠️ WARNING: Chats collection is empty or not accessible!");
    }
    
    return snapshot.docs.length;
  } catch (error) {
    console.error("❌ Error accessing Firestore:", error);
    console.error("❌ Error details:", error.message);
    return 0;
  }
};

/**
 * Fetch all chats where the admin is involved
 * Chat document IDs follow the format: userId1_userId2
 * @param {string} adminId - The logged-in admin's UID
 * @returns {Promise<Array>} Array of chat conversations
 */
export const fetchAdminChats = async (adminId) => {
  try {
    if (!adminId) {
      console.warn("fetchAdminChats: adminId is required");
      return [];
    }

    const adminIdTrimmed = adminId.trim();
    console.log("🔍 Searching for admin chats with adminId:", adminIdTrimmed);

    // Fetch ALL chats from the collection
    const chatsRef = collection(db, "chats");
    const snapshot = await getDocs(chatsRef);

    console.log("📊 Total chats fetched from database:", snapshot.docs.length);
    console.log("📋 All chat document IDs:");
    
    // Log all chat IDs first
    snapshot.docs.forEach((doc, index) => {
      console.log(`   [${index}] ${doc.id}`);
    });

    const adminChats = [];

    // Filter chats where admin ID is involved
    for (const doc of snapshot.docs) {
      const chatId = doc.id;
      
      console.log(`\n🔎 Processing chat: "${chatId}"`);

      // Check if admin ID exists anywhere in the chat ID
      if (chatId.includes(adminIdTrimmed)) {
        console.log(`✅ MATCH FOUND! Admin ID found in chat ID`);
        
        // Split to get the other user ID
        const [id1, id2] = chatId.split("_");
        const id1Trimmed = id1 ? id1.trim() : "";
        const id2Trimmed = id2 ? id2.trim() : "";
        
        // Get the other user's ID
        const otherUserId =
          id1Trimmed === adminIdTrimmed ? id2Trimmed : id1Trimmed;

        console.log(`   - Other User ID: ${otherUserId}`);

        // Get last message
        const lastMessage = await getLastAdminChatMessage(chatId);

        adminChats.push({
          chatId,
          adminId: adminIdTrimmed,
          otherUserId,
          lastMessage: lastMessage?.text || "",
          lastMessageTime: lastMessage?.createdAt || null,
          senderId: lastMessage?.senderId || null,
          ...doc.data(),
        });
      } else {
        console.log(`❌ No match - Admin ID not in this chat`);
      }
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
    console.log("📋 Admin chats:", adminChats);

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
    const messagesRef = collection(db, "chats", chatId, "messages");
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
    const messagesRef = collection(db, "chats", chatId, "messages");
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
 * @param {string} adminId - The logged-in admin's UID
 * @param {Function} callback - Function to call when chats update
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAdminChats = (adminId, callback) => {
  try {
    if (!adminId) {
      console.warn("subscribeToAdminChats: adminId is required");
      return () => {};
    }

    const chatsRef = collection(db, "chats");
    const adminIdTrimmed = adminId.trim();

    // Subscribe to chats collection
    const unsubscribe = onSnapshot(
      chatsRef,
      async (snapshot) => {
        const adminChats = [];

        for (const doc of snapshot.docs) {
          const chatId = doc.id;
          const [id1, id2] = chatId.split("_");

          // Check if admin is part of this chat
          if (
            id1.trim() === adminIdTrimmed ||
            id2.trim() === adminIdTrimmed
          ) {
            const otherUserId =
              id1.trim() === adminIdTrimmed ? id2.trim() : id1.trim();
            const lastMessage = await getLastAdminChatMessage(chatId);

            adminChats.push({
              chatId,
              adminId: adminIdTrimmed,
              otherUserId,
              lastMessage: lastMessage?.text || "",
              lastMessageTime: lastMessage?.createdAt || null,
              senderId: lastMessage?.senderId || null,
              ...doc.data(),
            });
          }
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

    const messagesRef = collection(db, "chats", chatId, "messages");
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
