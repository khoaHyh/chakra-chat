import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 4000;

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
    // use 'active' property of schema
    const response = await axios.post(
      'http://localhost:3080/login',
      // store production server address in env variable if not on Free Tier
      //'https://discord-clone-api-khoahyh.herokuapp.com/login',
      formData
    );
    const data = response.data;
    // Add check for email verification
    if (data) {
      console.log('verified! ', data);
      localStorage.setItem('session.id', data.username);
      setIsLoading(false);
      callback();
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
      setUsername('');
      setPassword('');
    }
  } catch (error) {
    console.log(`handleLogin ${error}`);
    setError('500 Internal Server Error');
    setIsLoading(false);
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

export const handleRegister = async (formData, setError, callback) => {
  try {
    const response = await axios.post(
      'http://localhost:3080/register',
      // store production server address in env variable if not on Free Tier
      //'https://discord-clone-api-khoahyh.herokuapp.com/register',
      formData
    );
    if (response.data) {
      console.log('registered!' + response.data);
      callback();
    } else {
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
    const response = await axios.get(
      'http://localhost:3080/logout'
      //'https://discord-clone-api-khoahyh.herokuapp.com/logout'
    );
    console.log(response.data.message);
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
