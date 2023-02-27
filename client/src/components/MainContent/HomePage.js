import { Outlet } from "react-router-dom";

import classes from "./HomePage.module.css";

const HomePage = () => {
  return (
    <>
      <div className={classes["main-content"]}>
        <h1>ברוכה הבאה לאתר מדור בטחון מידע!</h1>
        <p>באתר תוכלו לבקש בקשות ב"ם בקלות ובמהירות.</p>
      </div>
      <Outlet />
    </>
  );
};

export default HomePage;
