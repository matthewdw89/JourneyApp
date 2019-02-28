import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class MessagedUsers extends Component {
  render() {
      let background = { backgroundImage : `url(${this.props.img})` }
      let chatID;
      this.props.primaryUser
          ? chatID = [this.props.primaryUser._id, this.props.id].sort().join("")
          : chatID = null
    return (
        <Link to={`/chats/${chatID}`} className="messaged__user">
            <div className="messaged__img" style={background}>
            </div>
            <div className="messaged__info">
                <div>
                    <p className="messaged__name">{this.props.first_name} {this.props.last_name}</p>
                    <p>How are you</p>
                </div>
                <div className="messaged__time">
                    <p>9:01am</p>
                </div>
            </div>
        </Link>
    )
  }
}
