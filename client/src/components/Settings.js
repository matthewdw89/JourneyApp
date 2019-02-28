import React, { Component } from 'react';
import CloseImg from './IconComponents/CloseImg';

export default class Settings extends Component {

    componentDidMount() {
        this.props.checkToken();
    }

    render() {
        if (!this.props.primaryUser) {
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
                <div className="settings">
                    <nav className="settings__nav nav">
                        <div onClick={() => this.props.history.goBack()} className="nav__back">
                            <CloseImg />
                        </div>
                        <div className="nav__title">
                            <h1>Edit Profile</h1>
                            
                        </div>
                        <input type="submit" form="settings__form" value="" className="nav__save" />
                    </nav>
                    <div className="settings__img">
                        <div style={backgroundImg} className="settings__showImg"></div>
                        <h3 onClick={() => this.uploadPic.click()}>Change Photo</h3>
                        <input type="file" accept="image/*" onChange={this.imageAddedHandler} ref={uploadPic => this.uploadPic = uploadPic} style={{display: "none"}} />
                    </div>
                    <form id="settings__form" onSubmit={this.props.saveSettings}>
                        <div className="form__names">
                            <label>
                                First name
                                <input type="text" name="first_name" value={this.props.primaryUser.first_name} onChange={this.props.watch} />
                            </label>
                            <label>
                                Last name
                                <input type="text" name="last_name" value={this.props.primaryUser.last_name} onChange={this.props.watch}/>
                            </label>
                        </div>
                        <label>
                            Bio
                            <textarea type="text" name="bio" value={this.props.primaryUser.bio || ""} onChange={this.props.watch} />
                        </label>
                        <label>
                            Interests
                            <input type="text" name="interests" autoComplete="off" value={this.props.primaryUser.interests || ""} onChange={this.props.watch}/>
                        </label>
                        <div className="form__optionals">
                            <label>
                                Gender
                                <select type="text" name="gender" value={this.props.primaryUser.gender || "Female"} onChange={this.props.watch}>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                    <option value="Non-binary">Non-binary</option>
                                    <option value="Prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </label>
                            <label>
                                Nationality
                                <input type="text" name="nationality" value={this.props.primaryUser.nationality || ""} onChange={this.props.watch} />
                            </label>
                        </div>
                        <div className="form__private">
                            <h4>Private Information</h4>
                            <label>
                                Email address
                                <input type="text" placeholder={`Email (${this.props.primaryUser.email})`} onChange={this.props.watch}/>
                            </label>
                            <label>
                                Password
                                <input type="password" placeholder={`Password (unchanged)`} onChange={this.props.watch}/>
                            </label>
                        </div>
                    </form>
                    <div className="settings__logout">
                        <button onClick={this.props.logout} >Logout</button>
                    </div>
                </div>
            )
        }
    }
}
