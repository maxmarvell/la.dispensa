import { createContext, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { AuthContextType, ContextProps, LoginType, RegisterType } from "../@types/context";
import { BaseUser } from "../@types/user";

const AuthContext = createContext<AuthContextType | null>(null);
export default AuthContext;

export const AuthProvider = ({ children }: ContextProps) => {

  let [authToken, setAuthToken] = useState(() => {
    let auth = JSON.parse(localStorage.getItem("authToken")!)
    return auth
  });

  let [user, setUser] = useState(() => {
    return localStorage.getItem("authToken") ? jwtDecode(localStorage.getItem("authToken")!) as BaseUser : null
  });

  // login user handler
  const loginUser = async ({ email, password }: LoginType) => {
    console.log(email, password)
    try {
      let { data } = await axios.post(`${import.meta.env.VITE_SERVER}/api/users/login`,
        {
          email: email,
          password: password,
        });

      if (!data) {
        throw new Error('User not Found!')
      };

      setAuthToken(data.accessToken);
      setUser(jwtDecode(data.accessToken));
      localStorage.setItem('authToken', JSON.stringify(data.accessToken));

      axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    };
  };

  // register user handler
  let registerUser = async (newUser: RegisterType) => {
    try {
      // Try to register the new user with service
      let { data } = await axios.post(`${import.meta.env.VITE_SERVER}/api/users/`, newUser);

      if (!data) {
        throw new Error('Unable to register User!')
      };

      // Return the created user
      return data;

    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  };

  // logout user handler
  let logoutUser = async () => {
    // Remove auth tokens and user from context
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  // return the context
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