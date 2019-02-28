import React, { Component } from 'react'
// import AutoSearch from './AutoSearch'

export default class NextDestination extends Component {

    render() {
        return (
            <div onClick={this.props.toggleShowNext} style={this.props.showNext} className="next__background">
                <form className="next__destination" onSubmit={this.props.saveSettings} onClick={e => e.stopPropagation() }>
                    <label>
                        Where to next?
                        {/* <AutoSearch {...this.props}/> */}
                        <input id="destinationInput" type="text" name="next_destination" value={this.props.primaryUser.next_destination || ""} onChange={this.props.watch}/>
                        <input id="submitDesination" type="submit" name="submitDesination" />
                    </label>
                </form>
            </div>
        )
    }  
}
