import { useState } from "react";
import { getAllUsers, createUser } from "../services/UserService";

const App = () => {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [numberOfUsers, setNumberOfUsers] = useState(0);

  const createUser = (e) => {
    createUser(user).then((response) => {
      console.log(response);
      setNumberOfUsers(numberOfUsers + 1);
    });
  };

  const getAllUsers = () => {
    getAllUsers().then((users) => {
      console.log(users);
      setUsers(users);
      setNumberOfUsers(users.length);
    });
  };

  const onChangeForm = (e) => {
    // let user = this.state.user;
    if (e.target.name === "firstname") {
      user.firstName = e.target.value;
    } else if (e.target.name === "lastname") {
      user.lastName = e.target.value;
    } else if (e.target.name === "email") {
      user.email = e.target.value;
    }
    setUser({ user });
  };

  return (
    <div className="App">
      <div className="container mrgnbtm">
        <div className="row">
          <div className="col-md-8">
            <p>{user}</p>
            <p>{onChangeForm}</p>
            <p>{createUser}</p>
          </div>
          <div className="col-md-4">
            <p>{numberOfUsers}</p>
            <p>{getAllUsers}</p>
          </div>
        </div>
      </div>
      <div className="row mrgnbtm"></div>
    </div>
  );
};

export default App;
