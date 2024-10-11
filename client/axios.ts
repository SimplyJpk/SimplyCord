import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:3000/api/v1';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://127.0.0.1:3000';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export { axiosInstance };