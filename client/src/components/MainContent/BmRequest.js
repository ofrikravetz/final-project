import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import axios from "axios";

import classes from "./BmRequest.module.css";

const BmRequest = (props) => {
  const [isHeadlineValid, setIsHeadlineValid] = useState(true);
  const [isReasonValid, setIsReasonValid] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const headlineRef = useRef();
  const reasonRef = useRef();

  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    setIsHeadlineValid(true);
    setIsReasonValid(true);
    let isFormValid = true;

    const newReq = {
      headline: headlineRef.current.value,
      reason: reasonRef.current.value,
      time: new Date().getTime(),
    };

    const fetchNewReq = async () => {
      try {
        await axios.post(
          "/api/reqs",
          {
            ...newReq,
          },
          { headers: { Authorization: `Bearer ${authCtx.token}` } }
        );
        setIsCompleted(true);
      } catch (e) {
        console.log(e.message || "process failed");
      }
    };

    if (headlineRef.current.value.trim().length === 0) {
      setIsHeadlineValid(false);
      isFormValid = false;
    }

    if (reasonRef.current.value.trim().length === 0) {
      setIsReasonValid(false);
      isFormValid = false;
    }

    if (isFormValid) {
      headlineRef.current.value = "";
      reasonRef.current.value = "";
      fetchNewReq();
    }
  };

  const reqForm = (
    <form className={classes.form} onSubmit={submitHandler}>
      <div>
        <label htmlFor="headline">כותרת הבקשה</label>
        <input
          disabled={true}
          value={props.name}
          ref={headlineRef}
          id="headline"
          aria-autocomplete="none"
          className={isHeadlineValid ? "" : classes.invalid}
        />
        {!isHeadlineValid && <p className={classes["invalid-p"]}>שדה חובה!</p>}
      </div>
      <div>
        <label htmlFor="reason">סיבת בקשה</label>
        <textarea
          ref={reasonRef}
          id="reason"
          className={isReasonValid ? "" : classes.invalid}
          onFocus={() => {
            setIsCompleted(false);
          }}
        />
        {!isReasonValid && <p className={classes["invalid-p"]}>שדה חובה!</p>}
      </div>
      <button type="submit">הגש</button>
      {isCompleted && <p className={classes.success}>הבקשה הוגשה בהצלחה!</p>}
    </form>
  );

  const message = (
    <div className={classes.message}>
      <h1>אופס!</h1>
      <h2>עלייך להתחבר על מנת לבקש בקשות.</h2>
      <Link className={classes.link} to="/login">
        <button type="button">התחבר</button>
      </Link>
    </div>
  );

  return (
    <>
      <div className={classes.headline}>
        <h1>בקשת {props.name}</h1>
        <p>על מנת לבצע {props.description}, אנא מלאו את הטופס.</p>
      </div>
      {authCtx.isLoggedIn && reqForm}
      {!authCtx.isLoggedIn && message}
    </>
  );
};

export default BmRequest;
