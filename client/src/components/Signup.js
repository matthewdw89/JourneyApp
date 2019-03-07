import React, { Component } from 'react'
import { Link } from 'react-router-dom';


export default class Signup extends Component {

    submitSignup = (e) => {
        e.preventDefault();
        const { first_name, last_name, email, password} = e.target
        const newUser = { 
            first_name: first_name.value,
            last_name: last_name.value,
            email: email.value,
            password: password.value,
            location: {
                type: "Point",
                coordinates: [this.state.location.lng, this.state.location.lat]
            }
        }
        const init = {
            body: JSON.stringify(newUser),
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        }
        fetch("http://localhost:8080/signup", init)
            .then(res => res.json())
            .then(data => console.log(data))
            .then( () => {
                return this.props.history.push("/login")
            })
            .catch(err => console.log(err));
    }


    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.displayLocationInfo, this.handleLocationError);
        }
    }

    displayLocationInfo = (position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        this.setState({
            location: { lng: lng, lat: lat }
        })
    }

    handleLocationError = (error) => {
        console.log(error)
    }

    render() {
        return (
            <div className="signup">
                <div className="signup__form">
                    <form onSubmit={this.submitSignup}>
                        <label>
                            <input type="text" name="first_name" placeholder="First name" required/>
                        </label>
                        <label>
                            <input type="text" name="last_name" placeholder="Last name" required/>
                        </label>
                        <label>
                            <input type="email" name="email" placeholder="Email" required/>
                        </label>
                        <label>
                            <input type="password" name="password" placeholder="Password" required/>
                        </label>
                        <input id="signupSubmit" type="submit" value="Create account" />
                    </form>
                    <div className="signup__links">
                        <Link to="/login" >Already have an account?</Link>
                    </div>
                </div>
            </div>
        )
    }
}
