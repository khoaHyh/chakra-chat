import axios from 'axios';

export const login = async (
  formData,
  setError,
  setUsername,
  setPassword,
  setIsLoading,
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

    // Add check for email verification
    if (response.data) {
      console.log('verified! ' + response.data);
      callback();
    } else {
      setError('Invalid username or password');
      setUsername('');
      setPassword('');
    }
  } catch (err) {
    console.log(`handleLogin ${err}`);
    setError('500 Internal Server Error');
  }
};

export const register = async (formData, setError, callback) => {
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
  } catch (err) {
    console.log(`handleRegister ${err}`);
    setError('500 Internal Server Error');
  }
};

export const logout = async callback => {
  try {
    const response = await axios.get('http://localhost:3080/logout');
    console.log(response.data.message);
    callback();
  } catch (err) {
    console.log(err);
  }
};
