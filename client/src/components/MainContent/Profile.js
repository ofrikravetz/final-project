import { useContext, useState, useRef } from "react";
import AuthContext from "../../store/auth-context";

import classes from "./Profile.module.css";
import ReqItem from "../ReqItem/ReqItem";
import axios from "axios";

const Profile = (props) => {
  const authCtx = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const emailInput = useRef();

  let updateMsg;
  let updateClass;

  const logoutHandler = () => {
    async function logout() {
      try {
        await axios.post("api/users/logout", undefined, {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        });
        authCtx.logout();
      } catch (e) {
        console.log(e.message);
      }
    }

    logout();
  };
  const editEmail = async () => {
    const email = emailInput.current.value;
    try {
      await axios.patch(
        "api/user/email",
        {
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        }
      );
      updateMsg = "כתובת המייל עודכנה בהצלחה";
      updateClass = classes.success;
      setIsUpdated(true);
      setIsEditing(!isEditing);
      setTimeout(() => {
        setIsUpdated(false);
      }, 5000);
    } catch (e) {
      console.log(e.message);
      updateMsg = "בדקו את תקינות הכתובת ונסו שנית";
      updateClass = classes.failed;
      setIsFailed(true);
      setIsEditing(!isEditing);
      setTimeout(() => {
        setIsFailed(false);
      }, 5000);
    }
  };

  const clickHandler = () => {
    setIsEditing(!isEditing);
  };

  const reqOpenHandler = (isOpen, reqid, declineReason) => {
    props.onReqOpen(isOpen, reqid, declineReason);
  };

  return (
    <>
      {props.isLoading && <p>טוען...</p>}
      <ul className={classes.reqs}>
        {props.allreqs.map((bmreq) => {
          // console.log(bmreq);
          return (
            <ReqItem
              id={bmreq.id}
              declineReason={bmreq.declineReason}
              key={bmreq.key}
              headline={bmreq.headline}
              reason={bmreq.reason}
              isApproved={bmreq.isApproved}
              isOpen={bmreq.isOpen}
              onReqOpen={reqOpenHandler.bind(
                null,
                bmreq.isOpen,
                bmreq.id,
                bmreq.declineReason
              )}
              by={bmreq.owner}
              time={bmreq.time}
            />
          );
        })}
      </ul>
      {isUpdated && (
        <p className={classes.success}>כתובת המייל עודכנה בהצלחה</p>
      )}
      {isFailed && (
        <p className={classes.failed}>בדקו את תקינות הכתובת ונסו שנית</p>
      )}
      <button onClick={clickHandler}>עדכון פרטים</button>
      {isEditing && (
        <>
          <input placeholder="הזן כתובת מייל חדשה..." ref={emailInput} />{" "}
          <button onClick={editEmail}>הגש</button>
        </>
      )}
      <button className={classes.logout} onClick={logoutHandler}>
        התנתקות
      </button>
    </>
  );
};

export default Profile;
