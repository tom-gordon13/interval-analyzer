import { Button } from '@mui/material'
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

function NavMain({ }) {
    const { user, setUser } = useContext(UserContext);

    const handleSignOut = () => {
        setUser(null)
        document.cookie = 'stravaAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    return (
        <div className="w-full mt-0 h-20 flex justify-between pt-6 pr-4 pl-4">
            <h3 className=' text-black-500'>
                Interval Analyzer
            </h3>
            <div className="w-80 mt-0 h-20 flex justify-end pt-6 pr-4 pl-4">
                {user ? <h4 className='mr-4'>Hi, {user.firstname}</h4> : null}
                <Button onClick={handleSignOut} variant='contained' className='ml-4'>Sign Out</Button>
            </div>
        </div>
    );
}

export default NavMain;