import axios from 'axios';

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

export { axiosInstance };