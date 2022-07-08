import React, {useState, useEffect} from 'react';
import '../stylesheets/styles.css'
import AddTrip from './AddTrip'
import {
    Link, 
    useNavigate
} from 'react-router-dom';

function Trip (props) {

    function handleSubmit() {
        const navigate = useNavigate();
        navigate('/tripdetails', {replace: true});
    }
    
    return (
        <div>     
            <Link to="/map">
            <button className='addTripButton' onClick={handleSubmit}>
                <h1>Trip Name: {props.name}</h1>
                <h3>Location: {props.destination}</h3>
                <h3>Date: {props.start} - {props.end}</h3>
            </button>
            </Link>
        </div>
    );
}


export default Trip;