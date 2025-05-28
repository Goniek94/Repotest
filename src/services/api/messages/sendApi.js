// src/services/api/messages/sendApi.js

import apiClient from '../client';

// Funkcje związane z wysyłaniem wiadomości

// Wysyłanie nowej wiadomości
const send = (messageData) => {
  console.log('Wysyłanie nowej wiadomości:', messageData);
  const config = messageData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  return apiClient.post('/api/messages/send', messageData, config)
    .then(response => {
      console.log('Odpowiedź po wysłaniu wiadomości:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Błąd podczas wysyłania wiadomości:', error);
      throw error;
    });
};

// Wysyłanie wiadomości do użytkownika
const sendToUser = (userId, messageData) => {
  console.log(`Wysyłanie wiadomości do użytkownika ${userId}:`, messageData);
  const config = messageData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  return apiClient.post(`/api/messages/send-to-user/${userId}`, messageData, config)
    .then(response => {
      console.log(`Odpowiedź po wysłaniu wiadomości do użytkownika ${userId}:`, response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Błąd podczas wysyłania wiadomości do użytkownika ${userId}:`, error);
      throw error;
    });
};

// Wysyłanie wiadomości do ogłoszenia
const sendToAd = (adId, messageData) => {
  console.log(`Wysyłanie wiadomości do ogłoszenia ${adId}:`, messageData);
  const config = messageData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  return apiClient.post(`/api/messages/send-to-ad/${adId}`, messageData, config)
    .then(response => {
      console.log(`Odpowiedź po wysłaniu wiadomości do ogłoszenia ${adId}:`, response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Błąd podczas wysyłania wiadomości do ogłoszenia ${adId}:`, error);
      throw error;
    });
};

// Odpowiadanie na wiadomość
const replyToMessage = (messageId, messageData) => {
  console.log(`Odpowiadanie na wiadomość ${messageId}:`, messageData);
  const config = messageData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  return apiClient.post(`/api/messages/reply/${messageId}`, messageData, config)
    .then(response => {
      console.log(`Odpowiedź po odpowiedzi na wiadomość ${messageId}:`, response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Błąd podczas odpowiadania na wiadomość ${messageId}:`, error);
      throw error;
    });
};

export {
  send,
  sendToUser,
  sendToAd,
  replyToMessage
};