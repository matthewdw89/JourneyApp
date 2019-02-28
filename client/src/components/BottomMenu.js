import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import UserImg from './IconComponents/UserImg';
import FocusedUserImg from './IconComponents/FocusedUserImg';
import ChatImg from './IconComponents/ChatImg'
import FocusedChatImg from './IconComponents/FocusedChatImg';
import GroupImg from './IconComponents/GroupImg'


export default class BottomMenu extends Component {

  render() {
    let hidden = this.props.location.pathname === "/profile/edit" || this.props.location.pathname === "/login" || this.props.location.pathname === "/signup"
    return (
      <footer style={ hidden ? {display: "none"} : {display: "flex"}}>
        <Link to="/chats">
          {this.props.location.pathname === "/chats" ? <FocusedChatImg /> : <ChatImg />}
        </Link>
        <Link to="/users">
          <GroupImg />
        </Link>
        <Link to={`/profile/`}>
          {this.props.location.pathname === "/profile/" ? <FocusedUserImg /> : <UserImg />  }
        </Link>
      </footer>
    )
  }
}
