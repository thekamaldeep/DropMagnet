import React, { useState, useEffect } from "react";
import "./MainMenu.css";
import { Link, useHistory } from "react-router-dom";
import { LogoTitle, LogoTitleSection } from "../../elements/HeaderBar/LogoTitles";
import Avatar from "../../elements/Avatar/Avatar";
import { getInitials } from "../../../utils";
import FadeIn from 'react-fade-in';
import { useAuth } from "../../../contexts/FirebaseAuthContext";
import { Row } from "../../exploreGalleries/styled-components/Row";
import { Link as HeaderLink } from "../../exploreGalleries/styled-components/Link";
import GlossyButton from "../../elements/GlossyButton/GlossyButton";
import { getTokens } from "../../../DropMagnetAPI";

export default function MainMenu(props) {

  const { currentUser } = useAuth()
  const [open, setOpen] = useState(false);
  const [verified, setVerified] = useState(false)
  const [tokens, setTokens] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      let header = document.getElementsByClassName('fixed-container')[0]
      header.style.zIndex = 999999
    }
    else {
      document.body.style.overflow = 'auto'
      let header = document.getElementsByClassName('fixed-container')[0]
      setTimeout(() => {
        header.style.zIndex = 9998
      }, 600);
    }
  }, [open])


  const h = useHistory()

  useEffect(() => {
    (async () => {
      try {
        const r = await currentUser.getIdTokenResult()
        const is_verified = r.claims["verified"]
        setVerified(is_verified)
      } catch (error) {
        setVerified(false);
      }
    })()
  }, [])

  var menuList = [
    // {
    //   title: verified ? "Create a Drop" : "Apply for Drop Swipe",
    //   link: verified ? "create_drop" : "home"
    // },
    { title: "Settings", link: "/settings" },
    // { title: "Subscription", link: "/subscription" },
    // { title: "Get drop token", link: "/getToken" },
    { title: "About", link: "/about" },
    // { title: "What's a drop?", link: "/aboutDrop" },
    { title: "Terms and Conditions", link: "/term" },
    { title: "Logout", link: "/logout" },
  ];

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  function closeMenu() {
    props.setOpen(false);
  }

  function renderMenuItem(item, index) {
    return (
      <Link
        className="main-menu-item"
        style={{ marginBottom: "16px" }}
        key={index}
        to={item.link}
        onClick={() => props.setOpen(false)}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div className={open ? "main-menu-open" : "main-menu-closed"}>

      <div className="main-menu-holder">
        {props.userDetails !== {} && props.userDetails !== undefined ? (
          <div className="main-menu-header">
            <div className="user-details">
              <p style={{ fontWeight: "bold" }}>{props.userDetails.name}</p>
              <p style={{ paddingTop: "4px" }}>@{props.userDetails.username}</p>
            </div>
            <GlossyButton
              label={`${props.userDetails?.tokens || 0} Drop Tokens Earned`}
              btnStyle={{
                padding: '12px 14px 10px 14px',
                borderRadius: '27px',
                fontSize: '12px',
                fontWeight: '500'
              }}
              borderStyle={{
                pos: '-1px',
                borderRadius: '27px',
                border: '1px',
                grd1: '#181818',
                grd2: '#181818',
                grd3: '#6C00FF',
                grd4: '#FF00C7'
              }}
              lableStyle={{
                marginBottom: '-2px'
              }}
            ></GlossyButton>
          </div>
        ) : (
          <></>
        )}
        {open && (
          <FadeIn delay={100} childClassName="menu-list-item">
            {menuList.map(renderMenuItem)}
          </FadeIn>
        )}
      </div>
    </div>
  );
}
