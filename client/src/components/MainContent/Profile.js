import { useContext, useState } from "react";
import AuthContext from "../../store/auth-context";

import classes from "./Profile.module.css";
import ReqItem from "../ReqItem/ReqItem";
import axios from "axios";

const Profile = (props) => {
  const authCtx = useContext(AuthContext);

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
              onReqOpen={reqOpenHandler.bind(null, bmreq.isOpen, bmreq.id, bmreq.declineReason)}
              by={bmreq.owner}
              time={bmreq.time}
            />
          );
        })}
      </ul>
      <button className={classes.logout} onClick={logoutHandler}>
        התנתקות
      </button>
    </>
  );
};

export default Profile;
