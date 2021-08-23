import React, { useState } from 'react';
import { Link, useHistory, withRouter } from 'react-router-dom'
import "./HeaderBar.css"
import MainMenu from '../../detail_page/MainMenu/MainMenu'
import DatePicker from 'react-datepicker'
import CustomDateInput from './CustomDateInput';
import Avatar from '../Avatar/Avatar';
import { getInitials } from '../../../utils';
import { Row } from "../../exploreGalleries/styled-components/Row";
import { Link as HeaderLink } from "../../exploreGalleries/styled-components/Link";
import FadeIn from 'react-fade-in'

function HeaderBar(props) {

  const headerLoad = sessionStorage.getItem('headerLoad')

  const [mainMenuOpen, setMainMenuOpen] = useState(false)
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  const h = useHistory()
  let pageName = h.location.pathname.split('/')[1].toLowerCase()

  function showUserAction() {
    if (props && props.userLoggedIn && userDetails) {
      return <Link to={'/profile'} style={{ zIndex: 999999999999, textDecoration: 'none' }}>

        {headerLoad && headerLoad === 'true' ? (
          <div className="header-profile-img-holder">
            <Avatar userImage={userDetails.avatar_url}
              initial={getInitials(userDetails.name)}
              view_only
              small />
            {/* <img className="header-right-image" src={userDetails.avatar_url || './add-user-icon.png'}/> */}
          </div>
        ) : (
          <FadeIn delay={50} childClassName="child-content">
            <div className="header-profile-img-holder">
              <Avatar userImage={userDetails.avatar_url}
                initial={getInitials(userDetails.name)}
                view_only
                small
                style={{ marginTop: 2 }} />
              {/* <img className="header-right-image" src={userDetails.avatar_url || './add-user-icon.png'}/> */}
            </div>
          </FadeIn>
        )}

      </Link>
    } else {
      return null
    }


  }

  function openMenu() {
    setMainMenuOpen(true)
  }

  function openItem(e) {
  }


  return (
    <div className="header-container">
      {userDetails && <MainMenu userDetails={userDetails} userImage={userDetails.avatar_url} open={mainMenuOpen} setOpen={setMainMenuOpen} openItem={openItem} />}

      <div className="header-left-holder">
        <img alt={'logo'} style={{ width: 'auto', height: 'auto' }} onClick={() => {
          if (props.location.pathname === '/home') {
            props.history.push('/');
          } else {
            props.history.push('/home');
            sessionStorage.removeItem('headerLoad')
          }
        }} className="header-left-image clickable" src="./logo.svg" />

        {headerLoad && headerLoad === 'true' ? (
          <Row className="items-center">
            <HeaderLink to="/"
              style={{ textTransform: 'capitalize' }}>
              {pageName}
            </HeaderLink>
          </Row>
        ) : (
          <FadeIn delay={50} childClassName="child-content">
            <Row className="items-center">
              <HeaderLink to="/"
                style={{ textTransform: 'capitalize' }}>
                {pageName}
              </HeaderLink>
            </Row>
          </FadeIn>
        )}

        {props.datePickerVisible ? (
          <>
            {headerLoad && headerLoad === 'true' ? (
              <div className="react-datepicker-container" style={{ zIndex: '999' }}>
                <DatePicker
                  selected={new Date(props.curIndex)}
                  onChange={(date) => props.setSelectedDropdownDate(date)}
                  customInput={<CustomDateInput />}
                />
              </div>
            ) : (
              <FadeIn delay={50} childClassName="child-content">
                <div className="react-datepicker-container" style={{ zIndex: '999' }}>
                  <DatePicker
                    selected={new Date(props.curIndex)}
                    onChange={(date) => props.setSelectedDropdownDate(date)}
                    customInput={<CustomDateInput />}
                  />
                </div>
              </FadeIn>
            )}
          </>
        ) : <></>
        }


      </div>
      <div className="header-right-holder">
        {props.userImageVisible ?
          showUserAction()
          :
          <></>
        }
        {userDetails ? (
          <div onClick={() => setMainMenuOpen(!mainMenuOpen)} className="header-bar-menu-icon"
            style={{ zIndex: 999999999999 }}>
            <div class={`menu-icon ${mainMenuOpen ? 'close-icon' : ''}`}>
              <div class="leftright"></div>
              <div class="rightleft"></div>
            </div>
            {/* <img height={10} width={20}
              style={{ margin: 'auto' }}
              src="./menu-bars-icon.png" alt="/" /> */}
          </div>
        ) : <Link to={`/login/redirect/${props.dropId}`} id="login-link">Log In</Link>}
      </div>
    </div>

  );
}

export default withRouter(HeaderBar);