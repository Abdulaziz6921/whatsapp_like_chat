import { useState, useEffect, useCallback } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import Chat from "./components/Chat";
import {
  sendMessage,
  receiveMessage,
  deleteNotification,
} from "./api/greenApi";

function App() {
  const [credentials, setCredentials] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (idInstance, apiTokenInstance) => {
    setCredentials({ idInstance, apiTokenInstance });
    setIsAuthenticated(true);
  };

  const handleSendMessage = async (message) => {
    console.log(new Date().toISOString());
    if (!phoneNumber || !message || !credentials) return;

    try {
      const result = await sendMessage(credentials, phoneNumber, message);
      if (result) {
        const newMessage = {
          type: "outgoing",
          text: message,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const pollMessages = useCallback(async () => {
    if (!credentials) return;

    try {
      const notification = await receiveMessage(credentials);
      console.log(notification);

      if (notification) {
        const { receiptId, body } = notification;

        if (
          body.typeWebhook === "incomingMessageReceived" &&
          body.messageData?.typeMessage === "extendedTextMessage"
        ) {
          const newMessage = {
            type: "incoming",
            text: body.messageData.extendedTextMessageData.text,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, newMessage]);
        }

        await deleteNotification(credentials, receiptId);
      }
    } catch (error) {
      console.error("Error receiving message:", error.message);
    }
  }, [credentials]);

  useEffect(() => {
    let interval;
    if (isAuthenticated) {
      interval = setInterval(pollMessages, 10000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAuthenticated, pollMessages]);

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <Chat
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          messages={messages}
          onSendMessage={handleSendMessage}
          credentials={credentials}
        />
      )}
    </div>
  );
}

export default App;
