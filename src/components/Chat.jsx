import { useState } from "react";
import { checkWhatsappNumber } from "../api/greenApi";

function Chat({
  phoneNumber,
  setPhoneNumber,
  messages,
  onSendMessage,
  credentials,
}) {
  const [newMessage, setNewMessage] = useState("");
  const [phoneInput, setPhoneInput] = useState(phoneNumber || ""); // Temporary input state
  const [phoneError, setPhoneError] = useState("");
  const [isCheckingNumber, setIsCheckingNumber] = useState(false);

  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, ""); // Remove non-numeric characters
    if (cleaned.length < 10 || cleaned.length > 15) {
      return "Phone number must be between 10 and 15 digits";
    }
    return "";
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    const error = validatePhoneNumber(phoneInput);
    if (error) {
      setPhoneError(error);
      return;
    }

    setIsCheckingNumber(true);
    setPhoneError("");

    try {
      const exists = await checkWhatsappNumber(credentials, phoneInput);
      if (exists) {
        setPhoneNumber(phoneInput); // Save full number only when verified
      } else {
        setPhoneError("This number is not registered on WhatsApp");
      }
    } catch (error) {
      setPhoneError("Error verifying number. Please try again.");
    } finally {
      setIsCheckingNumber(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^[0-9+\s()-]*$/.test(value)) {
      setPhoneInput(value); // Use temporary state so it doesn't interfere with validation
      setPhoneError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-container">
      {!phoneNumber ? (
        <div className="phone-input">
          <form onSubmit={handlePhoneSubmit}>
            <input
              type="tel"
              placeholder="Enter phone number with country code (e.g., +998973676921)"
              value={phoneInput}
              onChange={handlePhoneChange}
              disabled={isCheckingNumber}
            />
            {phoneError && <div className="error-message">{phoneError}</div>}
            <button type="submit" disabled={isCheckingNumber || !phoneInput}>
              {isCheckingNumber ? "Checking number..." : "Start Chat"}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="chat-header">
            <span>{phoneNumber}</span>
          </div>
          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.type === "outgoing" ? "outgoing" : "incoming"
                }`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="timestamp">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <form className="message-input" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Chat;
