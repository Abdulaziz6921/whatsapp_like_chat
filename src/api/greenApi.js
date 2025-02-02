import axios from "axios";

const BASE_URL = "https://api.green-api.com";

const formatPhoneNumber = (phoneNumber) => {
  // Removing any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");
  // Removing leading zeros
  const withoutLeadingZeros = cleaned.replace(/^0+/, "");
  return withoutLeadingZeros;
};

export const validateCredentials = async (idInstance, apiTokenInstance) => {
  try {
    const url = `${BASE_URL}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`;
    const response = await axios.get(url);
    return response.data.stateInstance === "authorized";
  } catch (error) {
    console.error("API Error:", error.message);
    return false;
  }
};

export const checkWhatsappNumber = async (credentials, phoneNumber) => {
  try {
    const { idInstance, apiTokenInstance } = credentials;
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const url = `${BASE_URL}/waInstance${idInstance}/CheckWhatsapp/${apiTokenInstance}`;

    const response = await axios.post(url, {
      phoneNumber: formattedPhone,
    });

    return response.data.existsWhatsapp;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

export const sendMessage = async (credentials, phoneNumber, message) => {
  try {
    const { idInstance, apiTokenInstance } = credentials;
    const url = `${BASE_URL}/waInstance${idInstance}/SendMessage/${apiTokenInstance}`;

    const formattedPhone = formatPhoneNumber(phoneNumber);

    const response = await axios.post(url, {
      chatId: `${formattedPhone}@c.us`,
      message,
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

export const receiveMessage = async (credentials) => {
  try {
    const { idInstance, apiTokenInstance } = credentials;
    const url = `${BASE_URL}/waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

export const deleteNotification = async (credentials, receiptId) => {
  try {
    const { idInstance, apiTokenInstance } = credentials;
    const url = `${BASE_URL}/waInstance${idInstance}/DeleteNotification/${apiTokenInstance}/${receiptId}`;

    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};
