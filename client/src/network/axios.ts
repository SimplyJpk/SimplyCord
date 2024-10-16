import axios from 'axios';

import store from "../store/store";
import { setAuthSuccess, setAuthFailure, clearAuth } from "../slices/authSlice";

const { VITE_APP_DOMAIN_URL, VITE_APP_API_PATH } = import.meta.env;

const apiBaseUrl = `${VITE_APP_DOMAIN_URL}${VITE_APP_API_PATH}`;
const apiOrigin = new URL(apiBaseUrl).origin;

axios.defaults.baseURL = apiBaseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = apiOrigin;

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the token
export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
}

// Set token if it exists in localStorage
export function getAuthToken() {
  let token = localStorage.getItem('token');
  if (!token) {
    if (axiosInstance.defaults.headers.common['Authorization']) {
      token = axiosInstance.defaults.headers.common['Authorization'].split(' ')[1];
    }
  }
  return token;
}

// Function to initialize the session
export async function initializeSession() {
  await new Promise((resolve) => setTimeout(resolve, 0));
  const token = getAuthToken();
  if (token) {
    setAuthToken(token);
    // store.dispatch(setAuthStart()); // TODO: (James) isBusy/Loading state
    try {
      const response = await axiosInstance.get('/user/me');
      store.dispatch(setAuthSuccess({ token }));
      return response.data; // User profile data
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setAuthToken(null);
      // Handle this better?
      // store.dispatch(setAuthFailure({ error: error.message }));
    }
  } else {
    store.dispatch(clearAuth());
  }
}

// Call initializeSession when the module is loaded
initializeSession();

export default axiosInstance;