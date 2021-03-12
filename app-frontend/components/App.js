import { useState } from "react";
import { Header } from "./Header";
import { Users } from "./Users";
import { DisplayBoard } from "./DisplayBoard";
import CreateUser from "./CreateUser";
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
      <Header></Header>
      <div className="container mrgnbtm">
        <div className="row">
          <div className="col-md-8">
            <CreateUser
              user={user}
              onChangeForm={onChangeForm}
              createUser={createUser}
            ></CreateUser>
          </div>
          <div className="col-md-4">
            <DisplayBoard
              numberOfUsers={numberOfUsers}
              getAllUsers={getAllUsers}
            ></DisplayBoard>
          </div>
        </div>
      </div>
      <div className="row mrgnbtm">
        <Users users={users}></Users>
      </div>
    </div>
  );
};

export default App;
