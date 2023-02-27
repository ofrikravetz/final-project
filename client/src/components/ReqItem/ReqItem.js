import { useState, useContext, useEffect, useCallback } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./ReqItem.module.css";
import axios from "axios";

const ReqItem = (props) => {
  const authCtx = useContext(AuthContext);
  const [isReqOpen, setIsReqOpen] = useState(false);
  const [authour, setAuthour] = useState(undefined);
  const reqClass = props.isOpen
    ? ""
    : props.isApproved
    ? classes.approved
    : classes.declined;
  const adminClass =
    authCtx.isAdmin && props.isOpen && props.isAdminPage
      ? classes["admin-open"]
      : "";
  const allClasses = `${classes["is-open"]} ${reqClass} ${adminClass}`;
  const reqStatus = props.isOpen
    ? "הבקשה פתוחה"
    : props.isApproved
    ? "הבקשה אושרה"
    : "הבקשה סורבה";

  const clickHandler = () => {
    if (
      (!props.isOpen && !props.isApproved && !props.isAdminPage) ||
      (!props.isFullScreen &&
        authCtx.isAdmin &&
        props.isApproved !== true &&
        props.isAdminPage)
    ) {
      setIsReqOpen(!isReqOpen);
      props.onReqOpen(isReqOpen);
    }
  };

  let date = new Date(props.time).toLocaleDateString("he-IL", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });

  const getAuthour = useCallback(async () => {
    const url = `/api/reqowner/${props.by}`;
    try {
      const res = await axios.get(url);
      setAuthour(res.data.email);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    getAuthour();
  }, []);

  let divClasses = props.class ? `${classes.item} ${classes[props.class]}` : classes.item;

  return (
    <>
      <div className={divClasses}>
        <h1>{props.headline}</h1>
        <p className={classes.reason}>{props.reason}</p>
        <button className={allClasses} onClick={clickHandler}>
          {reqStatus}
        </button>
      </div>
      {authour && <div className={classes.detailes}>
        <p>{`מאת: ${authour}`}</p>
        <p>{date}</p>
      </div>}
    </>
  );
};

export default ReqItem;
