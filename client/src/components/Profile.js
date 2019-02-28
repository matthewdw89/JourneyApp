import React, { Component } from 'react'
import BackBtn from './IconComponents/BackBtn';
import LocationImg from './IconComponents/LocationImg';

// GOOGLE API
const API_KEY = "THIS WILL NEED TO BE YOUR API KEY FROM GOOGLE MAPS API"

export default class Profile extends Component {
  state = {
    viewUser: [],
    currentLoc:"",
    isLoading: true
  }

  fetchUser = (id) => {
    fetch(`http://localhost:8080/profile/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          viewUser: data,
          isLoading: false
        })
      })
      .then( () => {
        this.fetchGeoLoc()
      })
      .catch(err => console.log(err));
  }

  // fetchGeoLoc = () => {
  //   let lng = this.state.viewUser.location.coordinates[0]
  //   let lat = this.state.viewUser.location.coordinates[1]
  //   fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=locality&key=${API_KEY}`)
  //     .then( (res) => res.json(res))
  //     .then((data) => {
  //       this.setState({
  //         currentLoc: data.results[0].formatted_address
  //       })
  //     })
  //     .catch(err => console.log(err));
  // }

  componentDidMount(){
    this.props.checkToken();
    let id = this.props.match.params.userId
    this.fetchUser(id)
  }

  componentDidUpdate(prevProps, prevState){
    let currentID = this.props.match.params.userId
    if (currentID !== prevProps.match.params.userId){
      this.fetchUser(currentID)
    }
  }

  showNextDest = () => {
    if(this.state.hideForm.opacity === 0){
      this.setState({
        hideForm: { zIndex: 50, opacity: 1 }
      })
    } else {
      this.setState({
        hideForm: { zIndex: -50, opacity: 0 }
      })
    }
  }

  submitDestination = (e) => {
    e.preventDefault();
    const data = { destination: e.target.destination.value, id: this.state.primaryUser._id }
    const init = {
      body: JSON.stringify(data),
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      }
    }
    fetch("http://localhost:8080/profile", init)
      .then( () => this.fetchUser(this.state.viewUser._id))
      .catch(err => console.log(err));
    this.showNextDest()

  }

  render() {
    let backgroundImg = { backgroundImage: `url(${this.state.viewUser.img_url})`}
    if (this.state.isLoading){
      return(
        <div className="loading">
          <div className="loading__contents">
            <div className="loading__circle"></div>
            <div className="loading__half"></div>
          </div>
        </div>
      )
    }
    else {
    let chatID;  
      this.props.primaryUser 
        ? chatID = [this.props.primaryUser._id, this.state.viewUser._id].sort().join("") 
        : chatID = null
    return (
      <div className="profile">
        <div onClick={() => this.props.history.push("/users")} >
          <BackBtn {...this.props}/>
        </div>
        <div className="profile__hero">
          <div className="hero__background" style={backgroundImg}></div>
          <div className="hero__info">
            <h2>{this.state.viewUser.first_name + " " + this.state.viewUser.last_name}</h2>
            <div>
              <LocationImg/>
              <h4>{this.state.currentLoc}</h4>
            </div>
          </div>
        </div>
        <div className="profile__info">
          <div className="card profile__next">
            <h3>Next Destination</h3>
            <p>{this.state.viewUser.next_destination !== undefined || null ? this.state.viewUser.next_destination : "Unknown"}</p>
          </div>
          <div className="card profile__bio">
            <h4>Bio</h4>
            {this.state.viewUser.bio !== undefined ? <p>{this.state.viewUser.bio}</p> : <p>Add a bio about yourself...</p>}
          </div>
          <div className="card profile__interets">
            <h4>Interests</h4>
            <p>{this.state.viewUser.interests !== undefined ? this.state.viewUser.interests.map((each,i) => { return <span id={i} key={i}>{each}</span> }) : "Include some interests..."}</p>
          </div>
          <div onClick={() => this.props.history.push(`/chats/${chatID}`)} className="profile__message" >
            <p>Send Message</p>
          </div>
        </div>
      </div>
    )}
  }
}