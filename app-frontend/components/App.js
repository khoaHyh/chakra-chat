import { useState, useEffect } from "react";
import { getAllUsers, createUser } from "../services/UserService";
import Forms from "./Forms";

const forms = [
  { legend: "Login", action: "/api/login", value: "Login" },
  { legend: "Register", action: "/api/register", value: "Register" },
];

const App = () => {
  return (
    <div className="App">
      <div className="container mrgnbtm">
        <div className="row">
          <div className="col-md-8">
            <Forms forms={forms} />
          </div>
        </div>
      </div>
      <div className="row mrgnbtm"></div>
    </div>
  );
};

export default App;
