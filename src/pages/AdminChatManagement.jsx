import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  getDocs,
  onSnapshot,
  doc,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { getAllData } from "../Helper/firebaseHelper";

const AdminChatManagement = () => {
  // ---------------- USER / ADMIN IDENTIFICATION ----------------
  const reduxUser = useSelector((state) => state.home?.user || {});
  const { user: authUser } = useAuth();
  const user = reduxUser?.uid ? reduxUser : authUser || {};
  const adminId = user?.uid;

  // ---------------- STATE ----------------
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");


  useEffect(() => {
    console.log("Fetching chats...");
  
    getDocs(collection(db, "chats"))
      .then((snap) => {
        console.log("Docs count:", snap.size);
  
        snap.forEach((doc) => {
          console.log("Doc ID:", doc.id);
          console.log("Doc Data:", doc.data());
        });
      })
      .catch((err) => console.error("Error fetching chats:", err));
  }, []);
  


  const getChats = async () => {

    const allChat = await getAllData("chats")
    
    console.log("allChat" , allChat)
    
  }

  // ---------------- FETCH CHAT LIST ----------------
  useEffect(() => {

    getChats()
    const fetchChats = async () => {
      const chatsSnapshot = await getDocs(collection(db, "chats"));
      const adminChats = [];

      console.log(chatsSnapshot);

      chatsSnapshot.forEach((doc) => {
        const chatId = doc.id;

    alert (chatId)
        
        const ids = chatId.split("_");

        if (ids.includes(adminId)) {
          adminChats.push({
            id: chatId,
            otherUser: ids.find((x) => x !== adminId),
          });
        }
      });

      setChatList(adminChats);
    };

    if (adminId) fetchChats();
  }, [adminId]);

  // ---------------- OPEN CHAT & FETCH MESSAGES REALTIME ----------------
  const openChat = (chatId) => {
    setSelectedChat(chatId);

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
    });
  };

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async () => {
    if (!msgInput.trim()) return;

    await addDoc(collection(db, "chats", selectedChat, "messages"), {
      text: msgInput,
      senderId: adminId,
      recipientId: getRecipientId(selectedChat, adminId),
      createdAt: serverTimestamp(),
    });

    setMsgInput("");
  };

  // helper to get second user
  const getRecipientId = (chatId, adminId) => {
    const ids = chatId.split("_");
    return ids.find((id) => id !== adminId);
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
            key={chat.id}
            onClick={() => openChat(chat.id)}
            style={{
              padding: "12px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
              background: selectedChat === chat.id ? "#f1f1f1" : "white",
            }}
          >
            <strong>User:</strong> {chat.otherUser}
            <br />
            <small>ID: {chat.id}</small>
          </div>
        ))}
      </div>

      {/* ---------------- CHAT WINDOW ---------------- */}
      <div style={{ width: "70%", display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <>
            <div
              style={{
                padding: "10px",
                borderBottom: "1px solid #ccc",
                background: "#fafafa",
              }}
            >
              <strong>Chat ID:</strong> {selectedChat}
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
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: "12px",
                    textAlign: msg.senderId === adminId ? "right" : "left",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "10px",
                      borderRadius: "8px",
                      background:
                        msg.senderId === adminId ? "#d1ffd1" : "#e8e8e8",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
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
