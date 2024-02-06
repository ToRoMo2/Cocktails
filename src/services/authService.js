// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://100.74.7.87:3000'; // Remplacez par l'URL de votre serveur

export default {
  login(username, password) {
    return axios.post(`${API_URL}/login`, { username, password });
  },

  fetchData() {
    return axios.get(`${API_URL}/api/data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
};