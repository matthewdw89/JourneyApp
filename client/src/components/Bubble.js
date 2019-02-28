import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Plane from './IconComponents/Plane'


export default class Bubble extends Component {

  render() {
    let backgroundImage = { backgroundImage: `url(${this.props.img})`}
    let dist = Math.floor(this.props.distance / 1000)
    let planes = []
    if(dist <= 5){
      planes.push("✈")
    } else if(dist <= 20){
      planes.push("✈", "✈")
    } else {
      planes.push("✈", "✈", "✈")
    }
    return (

      <Link to={'/profile/' + this.props.id} className="user__bubble">
        <div className="bubble" style={ backgroundImage}>
        </div>
        <div className="bubble__distance">
          {
            planes.map( (each, i) => {
              return(
                <Plane key={i}/>
              )
            })
          }
        </div>
      </Link>
    )
  }
}
