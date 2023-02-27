import axios from "axios";
import { useState, useRef, useContext, useEffect, useCallback } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./Declined.module.css";

const Declined = (props) => {
  const [isDeclined, setIsDeclined] = useState(true);
  const [declineReason, setDeclineReason] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const declineReasonRef = useRef();
  const authCtx = useContext(AuthContext);

  const changeHandler = (event) => {
    const declineStatus = event.target.value === "true";
    setIsDeclined(declineStatus);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const feedback = {
      isApproved: !isDeclined,
      isOpen: false,
    };

    if (isDeclined) {
      feedback.declineReason = declineReasonRef.current.value;
    }

    const url = `/api/reqs/${props.reqId}`;
    try {
      await axios.patch(
        url,
        {
          ...feedback,
        },
        { headers: { Authorization: `Bearer ${authCtx.token}` } }
      );
      props.forceupdate();
    } catch (e) {
      console.log(e.message);
    }
  };

  const getDeclineReason = useCallback(async () => {
    const url = `/api/reqs/${props.reqId}`;
    try {
      setIsLoading(true);
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${authCtx.token}` },
      });
      setDeclineReason(res.data.declineReason);
      setIsLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  }, []); 

  useEffect(() => {
    getDeclineReason();
  }, [getDeclineReason]);



  const openContent = (
    <form className={classes.message} onSubmit={submitHandler}>
      <select onChange={changeHandler} className={classes.select}>
        <option value={true}>סירוב בקשה</option>
        <option value={false}>אישור בקשה</option>
      </select>
      {isDeclined && (
        <>
          <label htmlFor="declineReason">פירוט הסירוב</label>
          <textarea id="declineReason" ref={declineReasonRef} />
        </>
      )}
      <button type="submit">הגש</button>
    </form>
  );

  const closeInfo = (
    <div className={classes.message}>
      <div className={classes.explain}>
        <h3>בקשתך סורבה:</h3>
        <p> {isLoading ? 'טוען...' : declineReason || "בקשתך סורבה"}</p>
      </div>
      <button onClick={props.onReqOpen}>הבנתי</button>
    </div>
  );

  return (
    <div className={classes.all}>
      <div className={classes.overlay} onClick={props.onReqOpen}></div>
      {props.isOpen ? openContent : closeInfo}
    </div>
  );
};

export default Declined;
