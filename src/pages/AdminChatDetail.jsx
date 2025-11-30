import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAllData } from '../Helper/firebaseHelper';
import { subscribeToAdminChatMessages } from '../Helper/adminChatHelper';
import { useSelector } from 'react-redux';

export default function AdminChatDetail() {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const user = useSelector(state => state.home?.user || {});
  const adminId = user?.uid;


  
  const [otherUserId, setOtherUserId] = useState(null);
  const [otherUserName, setOtherUserName] = useState('User');
  
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!conversationId || !adminId) {
      navigate('/admin-chat-management');
      return;
    }

    // Extract other user ID from conversation ID
    const userIds = conversationId.split('_');
    const otherId = userIds.find(id => id !== adminId);
    setOtherUserId(otherId);

    // Fetch other user details
    const fetchOtherUser = async () => {
      try {
        const userData = await getAllData('users');
        const otherUser = userData.find(u => u.uid === otherId || u.email === otherId);
        if (otherUser) {
          setOtherUserName(
            otherUser.firstName 
              ? `${otherUser.firstName} ${otherUser.lastName || ''}`.trim()
              : otherUser.displayName || otherUser.email || 'User'
          );
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchOtherUser();

    // Subscribe to real-time messages
    const unsubscribe = subscribeToAdminChatMessages(conversationId, (fetchedMessages) => {
      setMessages(fetchedMessages);
      setLoading(false);
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [conversationId, adminId, navigate]);

  const handleSend = async () => {
    const trimmed = messageText.trim();
    if (!trimmed || !conversationId || !adminId || !otherUserId) {
      return;
    }

    setMessageText('');

    try {
      await addDoc(collection(db, 'messages', conversationId, 'messages'), {
        text: trimmed,
        senderId: adminId,
        recipientId: otherUserId,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (error) {
      return '';
    }
  };

  if (!conversationId) {
    return null;
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 40px)',
      background: '#f9fafb'
    }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/admin-chat-management')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              marginRight: '15px',
              color: '#667eea'
            }}
          >
            ←
          </button>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            marginRight: '12px'
          }}>
            {otherUserName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
              {otherUserName || 'User'}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
              {messages.length} messages
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#999',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px', opacity: 0.3 }}>💬</div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isAdmin = message.senderId === adminId;
            return (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: isAdmin ? 'flex-end' : 'flex-start',
                  marginBottom: '8px'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  background: isAdmin 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#fff',
                  color: isAdmin ? '#fff' : '#1a1a1a',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  border: !isAdmin ? '1px solid #e5e7eb' : 'none'
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    lineHeight: '1.5',
                    wordBreak: 'break-word'
                  }}>
                    {message.text}
                  </p>
                  <p style={{ 
                    margin: '6px 0 0 0', 
                    fontSize: '11px', 
                    opacity: 0.7,
                    textAlign: 'right'
                  }}>
                    {formatTimestamp(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        padding: '15px 20px',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-end'
      }}>
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '24px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'none',
            minHeight: '44px',
            maxHeight: '120px',
            outline: 'none'
          }}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!messageText.trim()}
          style={{
            background: messageText.trim() 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: messageText.trim() ? 'pointer' : 'not-allowed',
            fontSize: '18px',
            transition: 'all 0.2s ease'
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

