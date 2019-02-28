import React, { Component } from 'react'
import Messages from './Messages';
import ioClient from 'socket.io-client';

let socket = ioClient.connect('http://localhost:8080');  

export default class Chatroom extends Component {

    state = {
        comment: '',
        chatroomId: this.props.match.params.id,
        sender: null,
        messages: []
    }

    componentDidMount(){
        // Check users token
        this.props.checkToken();
        // Emit a user has connected to room
        let roomId = this.props.match.params.id;
        // Join Room
        socket.emit('join', roomId)
        // All messages
        socket.on('messages', (data) => {
            this.setState({
                messages: data
            })
        })
        // Recieve msg
        socket.on("received", (message) => {
            this.setState({
                messages: [...this.state.messages, message]
            })
        })
    }

    componentDidUpdate(){
        if(this.props.primaryUser !== null && this.state.sender === null){
            this.setState({
                sender: {
                    id: this.props.primaryUser._id,
                    name: this.props.primaryUser.first_name
                }
            })
        }
    }

    HandleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            comment: ""
        })
        let {comment, chatroomId, sender} = this.state
        socket.emit("newMessage", {comment:comment, chatroomId:chatroomId, sender:sender})
    }

    HandleTextChange = (event) => {
        this.setState({ comment: event.target.value });
    }


    componentWillUnmount() {
        socket.emit('disconnect', this.props.match.params.id)
    }



    render() {
        if (this.props.primaryUser === null) {
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
        return (
        <div className="chatroom">
            <nav className="chat__nav">
                <div className="chatroom__name">
                    <h1>Messages</h1>
                </div>
            </nav>
            <Messages messages={this.state.messages} primaryUser={this.props.primaryUser} />
            <form className="chatroom__form" onSubmit={this.HandleSubmit}>
                <input type="text"
                    onChange={this.HandleTextChange}
                    value={this.state.comment}
                    placeholder="Write a message..."
                    name="message__input"
                    required  />
            </form>
        </div>
        )}
    }
}
