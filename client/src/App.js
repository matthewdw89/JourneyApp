import React, { Component } from 'react';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom'
import PrimaryProfile from './components/PrimaryProfile';
import UsersList from './components/UsersList';
import Profile from './components/Profile';
import ChatBoard from './components/ChatBoard'
import ChatRoom from './components/ChatRoom';
import Settings from './components/Settings';
import Login from './components/Login';
import Signup from './components/Signup';
import BottomMenu from './components/BottomMenu';

class App extends Component {
  state = {
    primaryUser: null,
    currentLoc: null,
    hideForm: { zIndex: -50, opacity: 0 }
  }
  
  checkToken = () => {
    const token = JSON.parse(localStorage.getItem("token"))
    const init = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': token
      }
    }
    fetch("http://localhost:8080/me", init)
      .then(res => res.json())
      .then(data => {
        if(data.msg){
           return this.props.history.push("/login")
        } else {
          if(this.state.primaryUser === null){
            this.setState({
              primaryUser: data
            })
          }
        }
      })
      .then( () => {
        if (this.state.primaryUser && (this.props.location.pathname === ("/login" || "/signup"))){
          this.props.history.push("/users")
        }
      })
      .catch(err => console.log(err))
  }

  fetchPrimaryUser = () => {
    fetch(`http://localhost:8080/profile/${this.state.primaryUser._id}`, )
      .then(res => res.json())
      .then(data => this.setState({ primaryUser: data }))
      .catch(err => console.log(err))
  }

  // fetchGeoLoc = () => {
  //   let lng = this.state.primaryUser.location.coordinates[0]
  //   let lat = this.state.primaryUser.location.coordinates[1]
  //   fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=locality&key=${API_KEY}`)
  //     .then((res) => res.json(res))
  //     .then((data) => {
  //       this.setState({
  //         currentLoc: data.results[0].formatted_address
  //       })
  //     })
  //     .catch(err => console.log(err));
  // }

  handleUpdatingLocation = (newLoc) => {
    let {lng, lat} = newLoc
    let newState = {...this.state.primaryUser}
    newState.location.coordinates = [lng, lat]
    this.setState({
    })
  }

  handleSettingsInputs = (e, selected, lng, lat) => {
    let newUpdate; 
    if(e){ newUpdate = { ...this.state.primaryUser, [e.target.name]: e.target.value }}
    if(selected){ newUpdate = {...this.state.primaryUser, next_destination: selected}}
    // console.log(this.state.primaryUser)
    // console.log(e)
    // console.log(selected)
    this.setState({
      primaryUser: newUpdate
    })
  }

  toggleShowNext = () => {
    if (this.state.hideForm.opacity === 0) {
      this.setState({
        hideForm: { zIndex: 50, opacity: 1 }
      })
    } else {
      this.setState({
        hideForm: { zIndex: -50, opacity: 0 }
      })
    }
  }

  handleSaveSettings = (e) => {
    if(e){e.preventDefault();}
    if(this.props.location.pathname !== "/profile/edit"){
      this.toggleShowNext();
    }
    let toSend = this.state.primaryUser
    if(typeof(toSend.interests) === "string"){
      toSend.interests = this.state.primaryUser.interests.split(/\s*,\s*/)
    }
    const init = {
      body: JSON.stringify(toSend),
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      }
    }
    fetch("http://localhost:8080/profile", init)
      .then( () => {
        if (this.props.location.pathname === "/profile/edit") { this.props.history.push("/profile") }
      })
      .catch(err => console.log(err));
  }

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({
      primaryUser: null
    }, () => {return this.props.history.push("/login")})
  }

  componentDidUpdate(){
    if(!this.state.currentLoc && !!this.state.primaryUser){
      // this.fetchGeoLoc();
    }
  }

  render() {
    return (
        <div className="App">
          <main>
            <Switch>
            <Route path="/users" exact render={(props) => { return <UsersList primaryUser={this.state.primaryUser}
                                                                              checkToken={this.checkToken}
                                                                              fetchGeoLoc={this.fetchGeoLoc}
                                                                              UpdatingLocation = {this.handleUpdatingLocation}
                                                                              {...props}/>} }/>
              <Route path="/profile" exact render={(props) => { return <PrimaryProfile primaryUser={this.state.primaryUser}
                                                                                      currentLoc={this.state.currentLoc}
                                                                                      saveSettings={this.handleSaveSettings}
                                                                                      checkToken={this.checkToken}
                                                                                      watch={this.handleSettingsInputs}
                                                                                      update={this.fetchPrimaryUser}
                                                                                      toggleShowNext={this.toggleShowNext}
                                                                                      showNext = {this.state.hideForm}
                                                                                      {...props} />}}/>
              <Route path="/profile/edit" exact render={(props) => { return <Settings primaryUser={this.state.primaryUser} 
                                                                                      watch={this.handleSettingsInputs} 
                                                                                      checkToken={this.checkToken}
                                                                                      saveSettings={this.handleSaveSettings}
                                                                                      logout={this.handleLogout}
                                                                                      {...props}/>}} />
              <Route path="/profile/:userId" exact render={(props) => { return <Profile primaryUser={this.state.primaryUser}
                                                                                        checkToken={this.checkToken}
                                                                                        fetchGeoLoc={this.fetchGeoLoc}
                                                                                        {...props}/> }}/>
              <Route path="/chats/:id" exact render={(props) => { return <ChatRoom  checkToken={this.checkToken}
                                                                                    primaryUser={this.state.primaryUser}
                                                                                    {...props} /> }} />
              <Route path="/chats" exact render={ (props) => { return <ChatBoard {...props} checkToken={this.checkToken} primaryUser={this.state.primaryUser}/>}} />
              <Route path="/login" exact render={ (props) => { return <Login {...props} checkToken={this.checkToken} />}} />
              <Route path="/signup" exact render={ (props) => {return <Signup {...props} checkToken={this.checkToken} />}} />
              <Route path="/" render={() => { return <Redirect to="/login" /> }} />
            </Switch>
          </main>
          <BottomMenu {...this.props} />
        </div>
    );
  }
}

export default withRouter(App);
