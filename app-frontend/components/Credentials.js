import React from "react";

const Credentials = ({ legend, action, value }) => {
  return (
    <div>
      <legend>{legend}</legend>
      <form action={action} method="POST">
        <div>
          <label for="username"></label>
          <input type="text" id="username" name="username" required></input>
        </div>
        <div>
          <label for="password"></label>
          <input type="password" id="password" name="password" required></input>
        </div>
        <div>
          <input type="submit" value={value} />
        </div>
      </form>
    </div>
  );
};

export default Credentials;
