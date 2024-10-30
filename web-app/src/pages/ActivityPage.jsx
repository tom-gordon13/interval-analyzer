import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ActivityDialog } from '../components/activity/ActivityDialog';


const ActivityPage = ({ stravaAccessToken }) => {
    const { activityId } = useParams();
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showActivityDialog, setShowActivityDialog] = useState(false)

    const navigate = useNavigate();
    const serverPort = 3000

    const handleClose = () => {
        setShowActivityDialog(false)
    }

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:${serverPort}/activity/${activityId}`, {
                    headers: {
                        Authorization: `Bearer ${stravaAccessToken}`
                    }
                })
                return response.data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (activityId) {
            const fetchData = async () => {
                const fetchedActivity = await fetchActivity();
                setSelectedActivity(fetchedActivity)
                setShowActivityDialog(true)
            };

            fetchData();
        }
    }, [activityId, stravaAccessToken]);

    if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;
    if (!stravaAccessToken) navigate('/')
    if (!selectedActivity && !loading) return <p>No activity found.</p>;

    return (
        <div>
            <ActivityDialog
                open={showActivityDialog}
                onClose={handleClose}
                activity={selectedActivity}
                selectedActivity={selectedActivity}
            />
        </div>
    );
};

export default ActivityPage;
