import React, { Component } from 'react'
import MessagedUsers from './MessagedUsers';

export default class ChatBoard extends Component {
    state = {
        isLoading: true,
        messagedUsers: []
    }

    fetchMessagedUsers = () => {
        fetch(`http://localhost:8080/chats/${this.props.primaryUser._id}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    isLoading: false,
                    messagedUsers: data
                })
            })
    }

    componentDidMount(){
        this.props.checkToken();
        if(this.props.primaryUser){
            this.fetchMessagedUsers()
        }
    }

    componentDidUpdate(){
        if (this.state.isLoading) {
            this.fetchMessagedUsers()
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="loading">
                </div>
            )
        }
        else {
            return (
                <div className="chatboard">
                    <nav className="chat__nav">
                        <div className="chatboard__name">
                            <h1>Messages</h1>
                        </div>
                    </nav>
                    <div className="chatboard__users">
                        {
                            this.state.messagedUsers.map( (each, i) => {
                                return(
                                    <MessagedUsers
                                        img={each.img_url}
                                        id={each._id}
                                        first_name={each.first_name}
                                        last_name={each.last_name}
                                        primaryUser={this.props.primaryUser}
                                        key={i}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            )   
        }
    }
}
