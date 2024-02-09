import { createContext, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {

  let [authToken, setAuthToken] = useState(() =>
    localStorage.getItem('authToken')
      ? JSON.parse(localStorage.getItem('authToken'))
      : null
  );

  let [user, setUser] = useState(() =>
    localStorage.getItem('authToken')
      ? jwtDecode(localStorage.getItem('authToken'))
      : null
  );

  let loginUser = async (e) => {
    e.preventDefault();
    try {
      let { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/users/login`,
        {
          email: e.target.email.value,
          password: e.target.password.value,
        },
        {
          headers: { 'Content-Type': 'application/json' }
        },
        { withCredentials: true }
      );

      if (!data) {
        throw new Error('User not Found!')
      };

      setAuthToken(data.accessToken);
      setUser(jwtDecode(data.accessToken));
      localStorage.setItem('authToken', JSON.stringify(data.accessToken));

      axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

    } catch (error) {
      throw new Error(error.response.data.message);
    };
  };

  let registerUser = async ({ newUser }) => {
    try {
      // Try to register the new user with service
      let { data } = await axios.post(`${import.meta.env.VITE_SERVER}/api/users/`,
        newUser,
        {
          headers: { 'Content-Type': 'application/json' }
        },
        { withCredentials: true }
      )

      if (!data) {
        throw new Error('Unable to register User!')
      }

      // Return the created user
      return data;

    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  let logoutUser = async () => {
    // Remove auth tokens and user from context
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{
      user,
      authToken,
      loginUser,
      logoutUser,
      setAuthToken,
      setUser,
      registerUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};