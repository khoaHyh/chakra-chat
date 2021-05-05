import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

//const server = 'http://localhost:8080';
const server = 'https://discord-clone-api-khoahyh.herokuapp.com';

export const handleLogin = async (
  setIsLoading,
  formData,
  setError,
  setUsername,
  setPassword,
  callback
) => {
  setIsLoading(true);
  try {
    const response = await axios.post(`${server}/auth/login`, formData);
    const data = response.data;
    // Add check for email verification
    if (data.username) {
      console.log('verified! ', data);
      localStorage.setItem('session.id', data.username);
      setIsLoading(false);
      callback();
    } else {
      console.log('response:', response);
      console.log('login failed:', data);
      setError(data.message);
      setIsLoading(false);
      setUsername('');
      setPassword('');
    }
  } catch (error) {
    setIsLoading(false);
    if (error.response) {
      //The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log(error.response.data.message);
      setError(error.response.data.message);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
      setError('No response received.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error message: ', error.message);
    }
    if (error.code === 'ECONNABORTED') console.log('timeout');
    console.log(error.config);
    console.log(error);
    setUsername('');
    setPassword('');
  }
};

export const handleRegister = async (formData, setError, callback) => {
  try {
    const response = await axios.post(`${server}/auth/register`, formData);
    console.log(response.data.message);
    if (response.data) {
      console.log('registered:', response.data.email, response.data.username);
      callback();
    } else {
      console.log(response.data);
      setError(`${response.data.message}`);
    }
  } catch (error) {
    console.log(`handleRegister ${error}`);
    setError('500 Internal Server Error');
    if (error.response) {
      //The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error message: ', error.message);
    }
    if (error.code === 'ECONNABORTED') console.log('timeout');
    console.log(error.config);
    console.log(error);
  }
};

export const handleLogout = async callback => {
  try {
    const response = await axios.get(`${server}/auth/logout`);
    console.log(response.data);
    localStorage.removeItem('session.id');
    callback();
  } catch (error) {
    if (error.response) {
      //The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error message: ', error.message);
    }
    if (error.code === 'ECONNABORTED') console.log('timeout');
    console.log(error.config);
    console.log(error);
  }
};
