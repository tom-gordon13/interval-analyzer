import React from 'react';
import AuthButton from '../services/auth';

import { ActivitiesContainer } from '../components/activity/ActivitiesContainer'

function Home({ hasToken }) {
    return (
        <div>
            {hasToken ? (
                <div className="flex flex-row flex-wrap justify-evenly" >
                    <ActivitiesContainer />
                </div>
            ) : (<div>
                <AuthButton />
            </div>)
            }
        </div>
    )
}

export default Home;