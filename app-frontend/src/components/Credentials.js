import { useState } from "react";

const Credentials = ({ legend, action, value }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const onLogin = async () => {
    try {
      const response = await fetch("http://localhost:3080/api/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: password,
          username: username,
        }),
      });
      const user = await response.json();
      console.log(user);
      return user;
    } catch (err) {
      console.log(`onLogin ${err}`);
    }
  };

  return (
    <div>
      <legend>{legend}</legend>
      <form action={action} method="POST">
        <div>
          <label htmlFor="username"></label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter username"
            required
          />
        </div>
        <div>
          <label htmlFor="password"></label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            required
          />
        </div>
        <div>
          <input type="submit" value={value} onClick={onLogin} />
        </div>
      </form>
    </div>
  );
};

export default Credentials;
