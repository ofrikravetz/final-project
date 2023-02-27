import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import validator from "validator";
import useInput from "../../hooks/use-input";
import AuthContext from "../../store/auth-context";
import axios from "axios";

import classes from "./Login.module.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isError, setIsError] = useState(undefined);

  const authCtx = useContext(AuthContext);

  const {
    value: emailInput,
    error: emailError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    isValid: isEmailValid,
    reset: resetEmail,
  } = useInput(validator.isEmail);

  const {
    value: passwordInput,
    error: passwordError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    isValid: isPasswordValid,
    reset: resetPassword,
  } = useInput((value) => value.length >= 8);

  const navigate = useNavigate();

  const switchModeHandler = () => {
    setIsLogin((prevState) => {
      return !prevState;
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setIsError(undefined);

    const newUser = {
      email: emailInput,
      password: passwordInput,
    };

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    let url;

    if (isLogin) {
      url = "api/users/login";
    } else {
      url = "api/users/signin";
    }

    async function fetchUserReq() {
      try {
        const res = await axios.post(url, { ...newUser });
        const data = res.data;
        authCtx.login(data.token, data.expiresIn, data.user.isAdmin);
        navigate("/profile");
      } catch (e) {
        if (isLogin) {
          setIsError(e.response.data.error);
        } else {
          setIsError("כתובת המייל שהזנת תפוסה.");
        }
      }
    }

    fetchUserReq();
    resetEmail();
    resetPassword();
  };

  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <h1>{isLogin ? "התחברות" : "הרשמה"}</h1>
      <div>
        <label htmlFor="email">אימייל</label>
        <input
          value={emailInput}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          id="email"
          type="email"
          required
          className={!emailError ? "" : classes["invalid-form"]}
        />
        {emailError && (
          <p className={classes["invalid-form"]}>הזינו כתובת אימייל תקינה.</p>
        )}
      </div>
      <div>
        <label htmlFor="password">סיסמה</label>
        <input
          value={passwordInput}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          id="password"
          type="password"
          required
          className={!passwordError ? "" : classes["invalid-form"]}
        />
        {passwordError && (
          <p className={classes["invalid-form"]}>
            הסיסמה צריכה להכיל לפחות 8 תווים.
          </p>
        )}
      </div>
      <button type="submit">{isLogin ? "התחברו" : "הרשמו"}</button>
      <button
        type="button"
        className={classes["switch-btn"]}
        onClick={switchModeHandler}
      >
        {isLogin ? "אין לכם חשבון? הרשמו!" : "יש כבר חשבון? התחברו!"}
      </button>
      <Link to="newpass" className={classes.link}><button className={classes["switch-btn"]}>שכחת סיסמה?</button></Link>
      {isError && <p className={classes["invalid-form"]}>{isError}</p>}
    </form>
  );
};

export default Login;
