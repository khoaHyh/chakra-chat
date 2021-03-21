// Validate lowercase letters
const lowerCaseCheck = password => {
  let lowerCaseLetters = /[a-z]/g;
  if (!lowerCaseLetters.test(password)) {
    return false;
  }
  return true;
};

// Validate uppercase letters
const upperCaseCheck = password => {
  let upperCaseLetters = /[A-Z]/g;
  if (!upperCaseLetters.test(password)) {
    return false;
  }
  return true;
};

// Validate numbers
const numbersCheck = password => {
  let numbers = /[0-9]/g;
  if (!numbers.test(password)) {
    return false;
  }
  return true;
};

// Validate special characters
const specialCheck = password => {
  let specialChar = /[^a-zA-Z0-9\s]+/g;
  if (!specialChar.test(password)) {
    return false;
  }
  return true;
};

// Validate length
const pwLengthCheck = password => {
  if (password.length < 8) {
    return false;
  }
  return true;
};

// Regex for alphanumeric usernames containing at least 6 characters
const alphanumRegex = /^[0-9a-zA-Z]{6,}$/i;

// Regex for passwords with the criteria from the checks above
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;

const registerFormValidation = async (
  username,
  password,
  setIsLoading,
  register,
  setError,
  range,
  suffix
) => {
  // Check if username contains a minimum of 6 characters and is entirely alphanumeric
  if (alphanumRegex.test(username)) {
    // Use the api to check if the password has been pwned (found in database breach)
    setIsLoading(true);
    try {
      let response = await fetch(
        `https://api.pwnedpasswords.com/range/${range}`
      );
      let body = await response.text();
      let regex = new RegExp(`^${suffix}:`, 'm');

      if (passwordRegex.test(password)) {
        !regex.test(body)
          ? register()
          : setError(
              'This password has been found in a database breach. Please enter another password.'
            );
        setIsLoading(false);
      } else {
        setError('Password does not meet all requirements.');
        setIsLoading(false);
      }
    } catch (err) {
      console.log(`PwnedPasswords API, ${err}`);
      setError('500 Internal Server Error with PwnedPasswords API');
      setIsLoading(false);
    }
  } else {
    setError(
      'Username must contain at least 6 characters and be alphanumeric.'
    );
    setIsLoading(false);
  }
};

export {
  lowerCaseCheck,
  upperCaseCheck,
  numbersCheck,
  specialCheck,
  pwLengthCheck,
  registerFormValidation,
};
