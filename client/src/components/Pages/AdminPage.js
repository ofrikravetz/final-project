import { useState } from "react";
import AllReqs from "../MainContent/AllReqs";
import classes from "./AdminPage.module.css";
import Declined from "../ReqItem/Declined";

const AdminPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReqOpen, setIsReqOpen] = useState(undefined);
  const [reqId, setReqId] = useState(undefined);

  const [typeFilter, setTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("desc");

  const reqOpenHandler = (reqOpen, reqid) => {
    if (!isOpen) {
      setIsReqOpen(reqOpen);
    } else {
      setIsReqOpen(undefined);
    }
    setIsOpen(!isOpen);
    setReqId(reqid);
  };

  const changeHandler = (event) => {
    if (event.currentTarget.id === "type-filter") {
      setTypeFilter(event.target.value);
    } else if (event.currentTarget.id === "time-filter") {
      setTimeFilter(event.target.value);
    }
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes["reqs-container"]}>
          <h1>בקשות פתוחות</h1>
          <div className={classes.filter}>
            <label htmlFor="type-filter">סוג בקשה:</label>
            <select id="type-filter" onChange={changeHandler}>
              <option value="all">הכל</option>
              <option value="השחרה">השחרה</option>
              <option value="קידוד חוגר">קידוד חוגר</option>
              <option value='אישור כניסה לבה"ד'>אישור כניסה לבה"ד</option>
              <option value='חתימה על שו"ס'>חתימה על שו"ס</option>
            </select>
          </div>
          <div className={classes["main-content"]}>
            <AllReqs
              reqOpenHandler={reqOpenHandler}
              isFullScreen={isOpen}
              filters={{ isopen: "true", headline: typeFilter }}
            />
          </div>
        </div>
        <div className={classes["reqs-container"]}>
          <h1>היסטורית בקשות</h1>
          <div className={classes.filter}>
            <label htmlFor="time-filter">לפי תאריך:</label>
            <select id="time-filter" onChange={changeHandler}>
              <option value="desc">מהחדש לישן</option>
              <option value="asc">מהישן לחדש</option>
            </select>
          </div>
          <div className={classes["main-content"]}>
            <AllReqs
              reqOpenHandler={reqOpenHandler}
              isFullScreen={isOpen}
              filters={{ sort: timeFilter }}
            />
          </div>
        </div>
      </div>
      {isOpen && (
        <Declined onReqOpen={reqOpenHandler} isOpen={isReqOpen} reqId={reqId} />
      )}
    </>
  );
};

export default AdminPage;
