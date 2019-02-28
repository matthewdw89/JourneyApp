import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import InfoBtn from './IconComponents/InfoBtn'

class NavBar extends Component {
  render() {
    return (
      <nav className="nav">
          <div className="nav__title">
              <h2>JOURNEY</h2>
          </div>
          <div className="nav__info">
            <InfoBtn />
          </div>
      </nav>
    )
  }
}

export default withRouter(NavBar)
