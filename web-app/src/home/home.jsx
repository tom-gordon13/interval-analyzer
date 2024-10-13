import './home.css';
import React from 'react';

import { ActivitiesContainer } from '../activity/activities-container'

function Home() {
    return (
        <div className="home-container">
            <ActivitiesContainer />

        </div>
    );
}

export default Home;