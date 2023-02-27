import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import classes from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    const user = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.patch("/api/users", { ...user });
      const data = res.data;
      authCtx.login(data.token, data.expiresIn, data.user.isAdmin);
      navigate("/profile");

      emailRef.current.value = "";
      passwordRef.current.value = "";
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      <form onSubmit={submitHandler} className={classes.form}>
        <h1>איפוס סיסמה</h1>
        <div>
          <label htmlFor="email">אימייל</label>
          <input type="email" id="email" ref={emailRef} />
        </div>
        <div>
          <label htmlFor="new-password">סיסמה חדשה</label>
          <input type="password" id="new-password" ref={passwordRef} />
        </div>
        <button>שלח</button>
      </form>
    </>
  );
};

export default ForgotPassword;
