import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import UserImg from './IconComponents/FocusedUserImg';
import LockImg from './IconComponents/LockImg';

export default class Login extends Component {
    state = {
        error: null
    }

    login = (e) => {
        e.preventDefault();
        const {email, password} = e.target;
        const init = {
            body: JSON.stringify({email: email.value, password: password.value}),
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        }
        fetch("http://localhost:8080/login", init)
            .then(res => res.json())
            .then(data => {
                if(data.msg){
                    this.setState({error: data.msg})
                    setTimeout( () => {
                        this.setState({error: null})
                    }, 3000)
                } else {
                    localStorage.setItem("token", JSON.stringify(data.token))
                    return this.props.history.push("/users")
                }
            })
            .catch(err => console.log(err));
    }

    componentWillUnmount(){
        clearTimeout();
    }

  render() {
    return (
        <div className="login">
            <div className="login__logo">
                <h1>JOURNEY</h1>
            </div>
            <div className="login__form">
                <div className="login__error">
                    <p >{this.state.error}</p>
                </div>
                <form onSubmit={this.login}>
                    <label>
                        <UserImg />
                        <input type="email" name="email" placeholder="Email" /> 
                    </label>
                    <label>
                        <LockImg />
                        <input type="password" name="password" placeholder="Password" /> 
                    </label>
                    {/* <input type="radio"/>                   add a keep me signed in tick box that will create a token */}
                    <input id="loginSubmit" type="submit" value="Login"/>
                </form>
                <Link to="/signup" >Create New Account</Link>
            </div>
        </div>
    )
  }
}
