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

export {
  lowerCaseCheck,
  upperCaseCheck,
  numbersCheck,
  specialCheck,
  pwLengthCheck,
};
