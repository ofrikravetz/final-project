import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/Header/Header";
import HomePage from "./components/MainContent/HomePage";
import Login from "./components/MainContent/Login";
import "./App.css";
import AuthContext from "./store/auth-context";
import BmRequest from "./components/MainContent/BmRequest";
import ProfilePage from "./components/Pages/ProfilePage";
import AdminPage from "./components/Pages/AdminPage";
import ForgotPassword from "./components/MainContent/ForgotPassword";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {!authCtx.isLoggedIn && <Route path="/login" element={<Login />} />}
          {authCtx.isLoggedIn && (
            <Route path="/profile" element={<ProfilePage />} />
          )}
          <Route path="*" element={<Navigate to="/" replace={true} />} />
          <Route
            path="/bmreq/black"
            element={<BmRequest name="השחרה" description="השחרה" />}
          />
          <Route
            path="/bmreq/permit"
            element={
              <BmRequest
                name='אישור כניסה לבה"ד'
                description="בקשת הנפקת אישור כניסה"
              />
            }
          />
          <Route
            path="/bmreq/code"
            element={<BmRequest name="קידוד חוגר" description="קידוד חוגר" />}
          />
          <Route
            path="bmreq/shs"
            element={
              <BmRequest name='חתימה על שו"ס' description='חתימה על ש"וס' />
            }
          />
          {!authCtx.isLoggedIn && <Route path="/login/newpass" element={<ForgotPassword />} />}
          {authCtx.isAdmin && <Route path="/admin" element={<AdminPage />} />}
        </Routes>
      </main>
    </>
  );
}

export default App;
