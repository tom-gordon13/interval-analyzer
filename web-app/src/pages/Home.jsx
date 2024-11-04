import React, { useContext } from 'react';
import AuthButton from '../services/auth';
import { UserContext } from '../context/UserContext';

import { ActivitiesContainer } from '../components/activity/ActivitiesContainer'

export const Home = ({ hasToken }) => {
    const { user } = useContext(UserContext);

    return (
        <div>
            {hasToken || user ? (
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