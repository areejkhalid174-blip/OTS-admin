import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { fetchAdminChats, subscribeToAdminChatMessages } from "../Helper/adminChatHelper";
import { getAllData } from "../Helper/firebaseHelper";

const AdminChatManagement = () => {
  // ---------------- USER / ADMIN IDENTIFICATION ----------------
  const reduxUser = useSelector((state) => state.home?.user || {});
  const { user: authUser } = useAuth();
  const user = reduxUser?.uid ? reduxUser : authUser || {};
  // Try both uid and id properties - used for identifying admin messages
  const adminId = user?.uid || user?.id;

  // ---------------- STATE ----------------
  const [chatList, setChatList] = useState([]);
  const [selectedChatAutoDocId, setSelectedChatAutoDocId] = useState(null); // Auto-generated doc ID
  const [selectedChatInfo, setSelectedChatInfo] = useState(null); // Store chat info (chatId field, userId, etc.)
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [userDetails, setUserDetails] = useState({}); // Store user details for display

  // Debug: Log user info
  useEffect(() => {
    console.log("=== ADMIN CHAT DEBUG ===");
    console.log("Redux User:", reduxUser);
    console.log("Auth User:", authUser);
    console.log("Selected User:", user);
    console.log("Admin ID:", adminId);
    console.log("Admin ID type:", typeof adminId);
    console.log("Admin ID length:", adminId?.length);
    console.log("========================");
  }, [reduxUser, authUser, user, adminId]);

  // ---------------- FETCH CHAT LIST ----------------
  useEffect(() => {
    const fetchChats = async () => {
      console.log("✅ Fetching all admin chats");
      
      try {
        const adminChats = await fetchAdminChats();
        console.log("Admin chats fetched:", adminChats);
        
        // Fetch all users to get user details
        const allUsers = await getAllData("users");
        const userDetailsMap = {};
        allUsers.forEach((user) => {
          userDetailsMap[user.uid] = user;
        });
        setUserDetails(userDetailsMap);
        
        // Transform the data - store both autoDocId and chatId
        const formattedChats = adminChats.map((chat) => {
          const userId = chat.userId;
          const user = userDetailsMap[userId];
          const userName = user
            ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || `User ${userId.substring(0, 8)}`
            : `User ${userId.substring(0, 8)}`;
          
          return {
            autoDocId: chat.autoDocId, // Use this for Firestore operations
            chatId: chat.chatId, // The userId_adminId field for display
            userId: userId,
            userName: userName,
            lastMessage: chat.lastMessage,
            lastMessageTime: chat.lastMessageTime,
          };
        });
        
        console.log("🔵 Formatted chats:", formattedChats);
        setChatList(formattedChats);
      } catch (error) {
        console.error("Error fetching admin chats:", error);
      }
    };

    fetchChats();
  }, []);

  // ---------------- OPEN CHAT & FETCH MESSAGES REALTIME ----------------
  useEffect(() => {
    if (!selectedChatAutoDocId) {
      setMessages([]);
      return;
    }

    if (!adminId) {
      console.warn("Admin ID not available, cannot subscribe to messages");
      return;
    }

    console.log("🔵 Opening chat - autoDocId:", selectedChatAutoDocId);
    console.log("Admin ID for message comparison:", adminId);
    
    const unsubscribe = subscribeToAdminChatMessages(selectedChatAutoDocId, (msgs) => {
      console.log("📨 Messages received:", msgs);
      console.log("📨 Total messages:", msgs.length);
      console.log("📨 Admin ID:", adminId);
      
      if (msgs.length === 0) {
        console.warn("⚠️ No messages found in chat");
      }
      
      msgs.forEach((msg, index) => {
        console.log(`📨 Message ${index + 1}:`, {
          id: msg.id,
          text: msg.text,
          senderId: msg.senderId,
          recipientId: msg.recipientId,
          adminId: adminId,
          isFromAdmin: msg.senderId === adminId,
          comparison: `"${msg.senderId}" === "${adminId}" ? ${msg.senderId === adminId}`
        });
      });
      
      setMessages(msgs);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedChatAutoDocId, adminId]);

  const openChat = async (chat) => {
    // chat can be either an object with autoDocId or just the autoDocId string
    const autoDocId = chat?.autoDocId || chat;
    const chatIdField = chat?.chatId;
    const userId = chat?.userId;
    const userName = chat?.userName;
    
    console.log("🔵 openChat called with chat:", chat);
    console.log("🔵 autoDocId:", autoDocId);
    console.log("🔵 chatId field:", chatIdField);
    
    // If we have autoDocId directly, use it
    if (autoDocId && typeof autoDocId === 'string') {
      setSelectedChatAutoDocId(autoDocId);
      setSelectedChatInfo({
        autoDocId,
        chatId: chatIdField,
        userId,
        userName,
      });
    } else {
      // Otherwise, we need to find/create the chat using getOrCreateChat
      // This shouldn't happen if chatList is properly formatted, but handle it anyway
      console.warn("⚠️ Chat object doesn't have autoDocId, this shouldn't happen");
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async () => {
    if (!msgInput.trim() || !selectedChatAutoDocId) return;

    // Get recipient ID (userId) from selectedChatInfo
    const recipientId = selectedChatInfo?.userId;
    
    if (!recipientId) {
      console.error("Cannot send message: recipient ID (userId) not found");
      return;
    }

    if (!adminId) {
      console.error("Cannot send message: admin ID not found");
      return;
    }

    try {
      // Use "adminChats" collection
      await addDoc(collection(db, "adminChats", selectedChatAutoDocId, "messages"), {
        text: msgInput,
        senderId: adminId,
        createdAt: serverTimestamp(),
      });

      // Update the chat document's updatedAt timestamp
      const chatDocRef = doc(db, "adminChats", selectedChatAutoDocId);
      await updateDoc(chatDocRef, {
        updatedAt: serverTimestamp(),
      });

      setMsgInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", height: "90vh", border: "1px solid #ccc" }}>
      {/* ---------------- CHAT LIST ---------------- */}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Chats</h3>
        {chatList.length === 0 && <p style={{ textAlign: "center" }}>No chats found</p>}

        {chatList.map((chat) => (
          <div
            key={chat.autoDocId}
            onClick={() => openChat(chat)}
            style={{
              padding: "12px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
              background: selectedChatAutoDocId === chat.autoDocId ? "#f1f1f1" : "white",
            }}
          >
            <strong>{chat.userName || `User ${chat.userId?.substring(0, 8)}`}</strong>
            <br />
            {chat.lastMessage && (
              <>
                <small style={{ color: "#666", display: "block", marginTop: "4px" }}>
                  {chat.lastMessage.length > 50 
                    ? chat.lastMessage.substring(0, 50) + "..." 
                    : chat.lastMessage}
                </small>
              </>
            )}
            {chat.lastMessageTime && (
              <small style={{ fontSize: "10px", color: "#999", display: "block", marginTop: "4px" }}>
                {new Date(chat.lastMessageTime.toDate ? chat.lastMessageTime.toDate() : chat.lastMessageTime).toLocaleString()}
              </small>
            )}
          </div>
        ))}
      </div>

      {/* ---------------- CHAT WINDOW ---------------- */}
      <div style={{ width: "70%", display: "flex", flexDirection: "column" }}>
        {selectedChatAutoDocId ? (
          <>
            <div
              style={{
                padding: "10px",
                borderBottom: "1px solid #ccc",
                background: "#fafafa",
              }}
            >
              <strong>{selectedChatInfo?.userName || "User"}</strong>
              <br />
              <small style={{ fontSize: "11px", color: "#666" }}>
                Chatting with user
              </small>
            </div>

            {/* MESSAGES */}
            <div
              style={{
                flex: 1,
                padding: "15px",
                overflowY: "auto",
                background: "#fdfdfd",
              }}
            >
              {messages.length === 0 && (
                <p style={{ textAlign: "center", color: "#777" }}>No messages yet</p>
              )}
              {messages.map((msg) => {
                const isAdminMessage = msg.senderId === adminId;
                return (
                  <div
                    key={msg.id}
                    style={{
                      marginBottom: "12px",
                      textAlign: isAdminMessage ? "right" : "left",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        padding: "10px",
                        borderRadius: "8px",
                        background: isAdminMessage ? "#d1ffd1" : "#e8e8e8",
                        maxWidth: "70%",
                      }}
                    >
                      <div>{msg.text}</div>
                      {msg.createdAt && (
                        <small style={{ 
                          display: "block", 
                          marginTop: "4px", 
                          fontSize: "10px", 
                          color: "#666",
                          opacity: 0.7 
                        }}>
                          {msg.createdAt.toDate ? 
                            new Date(msg.createdAt.toDate()).toLocaleTimeString() : 
                            new Date(msg.createdAt).toLocaleTimeString()}
                        </small>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* INPUT BOX */}
            <div
              style={{
                padding: "10px",
                borderTop: "1px solid #ccc",
                display: "flex",
                gap: "10px",
              }}
            >
              <input
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: "10px 20px",
                  background: "black",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#777",
            }}
          >
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatManagement;
