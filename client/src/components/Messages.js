import React, { Component } from 'react'
import EachMessage from './EachMessage';

export default class Messages extends Component {



  render() {
      return (
            <div className='messages__box'>
                {
                    this.props.messages.map((eachMessage, i) => {
                        return (
                            <EachMessage
                                key={i}
                                message={eachMessage.comment}
                                sender={eachMessage.sender}
                                primaryUser={this.props.primaryUser}
                                date={eachMessage.date_created} />
                        )
                    }).reverse()
                }
            </div>
      );
  }
}
