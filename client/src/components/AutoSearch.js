import React from "react";


export default class AutoSearch extends React.Component {
    constructor() {
        super();
        this.autocompleteInput = React.createRef();
        this.autocomplete = null;
    }

    componentDidMount() {
        this.autocomplete = new window.google.maps.places.Autocomplete(this.autocompleteInput.current,
            { "types": "cities" });
        this.autocomplete.setFields(["geometry", "formatted_address"])

        this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
    }

    handlePlaceChanged = () => {
        const place = this.autocomplete.getPlace()
        let lat,lng;
        if (place.geometry){
            lat = place.geometry.location.lat()
            lng = place.geometry.location.lng()
        }
        this.props.watch(null ,place, lng, lat)
    }



    render() {
        return (
            <input ref={this.autocompleteInput} id="destinationInput" name="next_destination" placeholder="Enter your address"
                type="text" value={this.props.primaryUser.next_destination || ""} onChange={this.props.watch}>
            </input>
        );
    }
}