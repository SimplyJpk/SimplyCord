import axios from 'axios';
import store from "./src/store/store";
import { setAuthSuccess, setAuthFailure, clearAuth } from "./src/slices/authSlice";

// TODO: (James) Move to .env
let apiBaseUrl: string;
if (process.env.NODE_ENV === 'development') {
  apiBaseUrl = 'http://localhost:3000/api/v1';
} else {
  apiBaseUrl = 'https://server.simplytf.com/api/v1';
}
axios.defaults.baseURL = apiBaseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = apiBaseUrl;

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
  const token = localStorage.getItem('token');
  if (token) {
    return token;
  }
  if (axiosInstance.defaults.headers.common['Authorization']) {
    return axiosInstance.defaults.headers.common['Authorization'].split(' ')[1];
  }
  return null;
}

// Function to initialize the session
export async function initializeSession() {
  await new Promise((resolve) => setTimeout(resolve, 0));
  const token = getAuthToken();
  if (token) {
    setAuthToken(token);
    // store.dispatch(setAuthStart());
    try {
      const response = await axiosInstance.get('/user/me');
      store.dispatch(setAuthSuccess({ token }));
      return response.data; // User profile data
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setAuthToken(null); // Clear the token if the request fails
      store.dispatch(setAuthFailure({ error: error.message }));
      // Handle error (e.g., redirect to login page)
    }
  } else {
    store.dispatch(clearAuth());
    // Handle case where there is no token (e.g., redirect to login page)
  }
}

// Call initializeSession when the module is loaded
initializeSession();

export { axiosInstance };