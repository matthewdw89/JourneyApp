import React, { Component } from 'react'

export default class EachMessage extends Component {


    
    render() {
        let msgID = this.props.sender.id
        let UserID = this.props.primaryUser._id
        // Checking to see if the ids of primary user and the msg match
        const fromMe = msgID === UserID ? 'me' : 'them';
        return (
            <div className={`from__${fromMe}`}>
                <div className='message__body'>
                    <p>{this.props.message}</p>
                </div>
                <div className='message__details'>
                    <p>{this.props.sender.name}</p>
                </div>
            </div>
        );
    }

}
