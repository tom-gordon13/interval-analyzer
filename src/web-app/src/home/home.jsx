import './home.css';
import React from 'react';
import { ActivitiesContainer } from '../activity/activities-container'

function Home() {
    return (
        <div className="home-container"
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
            }}>

            <ActivitiesContainer />

        </div>
    );
}

export default Home;