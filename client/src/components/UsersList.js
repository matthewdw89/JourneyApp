import React, { Component } from 'react';
import NavBar from './NavBar';
import Bubble from './Bubble';
import BottomMenu from './BottomMenu';

export default class UsersList extends Component {
    state = {
        users: false,
        location: false
    }

    componentDidMount(){
        this.props.checkToken();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.displayLocationInfo, this.handleLocationError);
        }
    }

    componentDidUpdate(){
        if(this.props.primaryUser !== null){
            if(this.state.users === false && this.state.location !== false){
                const toSend = {loc: this.state.location, id: this.props.primaryUser._id}
                const init = {
                    body: JSON.stringify(toSend),
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    }
                }
                fetch("http://localhost:8080/users", init)
                    .then(res => res.json())
                    .then(data => {
                        this.setState({
                            users: data
                        }, () => this.props.UpdatingLocation(this.state.location))
                    })
                    .catch(err => console.log(err));
            }
        }
    }

    displayLocationInfo = (position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        this.setState({
            location: {lng: lng, lat: lat}
        })
    }

    handleLocationError = (error) => {
        console.log(error)
    }

  render() {
      if(!this.state.users){
        return (
            // Showing loading screen while user location is being set and array its being fetched
            <div className="users__background">
                <NavBar />
                <div className="loading">
                    <div className="loading__contents">
                        <div className="loading__circle"></div>
                        <div className="loading__half"></div>
                    </div>
                </div>
                <BottomMenu {...this.props} />
            </div>
        )
        } else {
            return(
                <div className="users__background">
                    <NavBar />
                    <div className="users">
                        {
                            this.state.users.map(each => {
                                if (this.props.primaryUser._id !== each._id) {
                                    return <Bubble key={each._id} 
                                                id={each._id} 
                                                img={each.img_url}
                                                distance={each.dist.calculated} />
                                } else {
                                    return true
                                }
                            })
                        }
                    </div>
                </div>
            )
        }
    }
}
