import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import BackBtn from './IconComponents/BackBtn';
import SettingsBtn from './IconComponents/SettingsBtn';
import LocationImg from './IconComponents/LocationImg';
import NextImg from './IconComponents/NextImg';
import NextDestination from './NextDestination';

export default class PrimaryProfile extends Component {


    showNextDest = () => {
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

    componentDidMount(){
        this.props.checkToken();
    }

    deleteInterest = (index) => {
        const init = {
            method: "DELETE"
        };
        fetch(`http://localhost:8080/profile/${this.props.primaryUser._id}/interest/${index}`, init)
            .then((resp) => (resp))
            .then(() => {
                this.props.update();
            })
            .catch((err) => { console.error("Caught error: ", err) });
    }

    render() {
        if (!this.props.primaryUser ) {
            return (
                <div className="loading">
                    <div className="loading__contents">
                        <div className="loading__circle"></div>
                        <div className="loading__half"></div>
                    </div>
                </div>
            )
        }
        else {
            let backgroundImg = { backgroundImage: `url(${this.props.primaryUser.img_url})` }
            return (
                <div className="profile">
                    <div className="profile_topbtn">
                        <div onClick={() => this.props.history.push("/users")} >
                            <BackBtn {...this.props} />
                        </div>
                        <Link to="/profile/edit">
                            <SettingsBtn {...this.props} />
                        </Link >
                    </div>
                    <div className="profile__hero">
                        <div className="hero__background" style={backgroundImg}></div>
                        <div className="hero__info">
                            <h2>{this.props.primaryUser.first_name + " " + this.props.primaryUser.last_name}</h2>
                            <div>
                                <LocationImg />
                                <h4>{this.props.currentLoc}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="profile__info">
                        <div className="card profile__next">
                            <h3>Next Destination</h3>
                            <p>{!this.props.primaryUser.next_destination 
                                    ? "Unknown" 
                                    : this.props.primaryUser.next_destination}
                                    <span onClick={this.props.toggleShowNext}>
                                        <NextImg showNextDest={this.showNextDest} {...this.props} />
                                    </span>
                            </p>
                        </div>
                        <NextDestination {...this.props} />
                        <div className="card profile__bio">
                            <h4>Bio</h4>
                            {this.props.primaryUser.bio !== undefined ? <p>{this.props.primaryUser.bio}</p> : <p>Add a bio about yourself...</p>}
                        </div>
                        <div className="card profile__interets">
                            <h4>Interests</h4>
                            <p>
                                {
                                    this.props.primaryUser.interests !== undefined 
                                        ? this.props.primaryUser.interests.map((each, i) => {
                                            return <span id={i} key={i} onClick={ () => this.deleteInterest(each)}>{each}</span>
                                        }) 
                                        : "Include some interests..."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
