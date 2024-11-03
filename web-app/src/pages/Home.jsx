import React from 'react';
import AuthButton from '../services/auth';

import { ActivitiesContainer } from '../components/activity/ActivitiesContainer'

function Home({ hasToken, user }) {
    return (
        <div>
            {hasToken || user ? (
                <div className="flex flex-row flex-wrap justify-evenly" >
                    <ActivitiesContainer user={user} />
                </div>
            ) : (<div>
                <AuthButton />
            </div>)
            }
        </div>
    )
}

export default Home;