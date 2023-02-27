import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  isAdmin: false,
  login: (token) => {},
  logout: () => {},
});

const caculateRemainingTime = (expiresIn) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = expiresIn * 1000;

  const remainingTime = adjExpirationTime - currentTime;
  return remainingTime;
};

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const initialIsAdmin = localStorage.getItem("admin");
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);

  const userIsLoggedIn = !!token;

  const logoutHandler = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
  };

  const loginHandler = (token, expiresIn, admin) => {
    setIsAdmin(admin);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("admin", true);

    const remainingTime = caculateRemainingTime(expiresIn);

    setTimeout(logoutHandler, remainingTime);
  };

  const contextValue = {
    token,
    isAdmin,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
