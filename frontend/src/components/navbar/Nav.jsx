import React from "react";
import "./nav.css";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  const openSignUpPage = () => {
    navigate('/signin');
  }
  const openSignInPage = () => {
    navigate('/login');
  }
  return (
    <div className="container ">
      <p className="item">ToDo-MERN</p>
      <div className="sign-container">
        <p className="item" onClick={openSignUpPage}>Sign Up</p>
        <p onClick={openSignInPage} className="item">Sign In</p>
      </div>
    </div>
  );
};

export default Nav;
