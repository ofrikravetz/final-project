import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./Header.module.css";

const Header = () => {
  const authCtx = useContext(AuthContext);

  return (
    <header className={classes.header}>
      <h1>מדור ביטחון מידע</h1>
      <div className={classes.toolbar}>
        {authCtx.isLoggedIn && (
          <Link className={classes.link} to="profile">
            <button>אזור אישי</button>
          </Link>
        )}
        {!authCtx.isLoggedIn && (
          <Link className={classes.link} to="login">
            <button>התחברות</button>
          </Link>
        )}
        <div className={classes.dropdown}>
          <button>הגשת בקשה</button>
          <ul className={classes["dropdown-content"]}>
            <Link className={classes.link} to="bmreq/black"><li>השחרה</li></Link>
            <Link className={classes.link} to="bmreq/permit"><li>אישור כניסה לבה"ד</li></Link>
            <Link className={classes.link} to="bmreq/code"><li>קידוד חוגר</li></Link>
            <Link className={classes.link} to="bmreq/shs"><li>חתימה על שו"ס</li></Link>
          </ul>
        </div>
        {authCtx.isAdmin && (
          <Link className={classes.link} to="admin">
            <button>ניהול בקשות</button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
