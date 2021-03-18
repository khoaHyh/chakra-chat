import React, { useContext, createContext, useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 50000;

export default function App() {
  return (
    <ProvideAuth>
      <Router>
        <div>
          <AuthButton />

          <ul>
            <li>
              <Link to="/public">Public Page</Link>
            </li>
            <li>
              <Link to="/protected">Protected Page</Link>
            </li>
            <li>
              <Link to="/logout">ForceLogout Page</Link>
            </li>
          </ul>

          <Switch>
            <Route path="/public">
              <PublicPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/logout">
              <ForceLogout />
            </Route>
            <PrivateRoute path="/protected">
              <ProtectedPage />
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    </ProvideAuth>
  );
}

const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

const authContext = createContext();

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const login = async (formData, setUsername, setPassword, callback) => {
    //setIsLoading(true);
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
        setUser(response.data);
        return callback();
      } else {
        //setError('Invalid username or password');
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.log(`handleLogin ${error}`);
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
      console.log(error.toJSON());
      //setError('500 Internal Server Error');
    }
  };

  const register = async (formData, callback) => {
    try {
      const response = await axios.post(
        'http://localhost:3080/register',
        // store production server address in env variable if not on Free Tier
        //'https://discord-clone-api-khoahyh.herokuapp.com/register',
        formData
      );
      if (response.data) {
        console.log('registered!' + response.data);
        setUser(response.data);
        callback();
      } else {
        console.log(response.data.message);
      }
    } catch (err) {
      console.log(err);
      //setError('500 Internal Server Error');
    }
  };

  const logout = async callback => {
    try {
      const response = await axios.get('http://localhost:3080/logout');
      console.log('user: ' + user + ' ' + response.data.message);
      setUser(null);
      callback();
    } catch (err) {
      console.log(err);
    }
  };

  return {
    user,
    login,
    register,
    logout,
  };
}

function AuthButton() {
  let history = useHistory();
  let auth = useAuth();

  return auth.user ? (
    <p>
      Welcome!{' '}
      <button
        onClick={() => {
          auth.logout(() => history.push('/'));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function ForceLogout() {
  let auth = useAuth();
  let history = useHistory();
  return (
    <button
      onClick={auth.logout(() => {
        history.push('/');
      })}
    >
      Force Logout
    </button>
  );
}

function PublicPage() {
  return <h3>Public</h3>;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const formData = { username: username, password: password };

  const onUsernameChange = event => {
    setUsername(event.target.value);
  };

  const onPasswordChange = event => {
    setPassword(event.target.value);
  };

  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: '/' } };
  let login = () => {
    auth.login(formData, setUsername, setPassword, () => {
      history.replace(from);
    });
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <form>
        <label>User Name</label>
        <input
          type="text"
          data-test="username"
          value={username}
          onChange={onUsernameChange}
        />
        <label>Password</label>

        <input
          type="password"
          data-test="password"
          value={password}
          onChange={onPasswordChange}
        />
        <button onClick={login}>Log in</button>
      </form>
    </div>
  );
};
