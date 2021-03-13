import React from "react";

const Register = () => {
  return (
    <div>
      <legend>Register</legend>
      <form action="register" method="POST">
        <div>
          <label for="username"></label>
          <input type="text" id="username" name="username" required></input>
        </div>
        <div>
          <label for="password"></label>
          <input type="password" id="password" name="password" required></input>
        </div>
        <div>
          <input type="submit" value="Register" />
        </div>
      </form>
    </div>
  );
};

export default Register;
