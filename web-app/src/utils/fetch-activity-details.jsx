export const fetchActivityDetails = async (accessToken, activity) => {
    try {
        const response = await fetch(`https://www.strava.com/api/v3/activities/${activity.id}?include_all_efforts="true"`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch activity details');
        }

        const activityDetails = await response.json();
        activityDetails.streams = await fetchActivityStreams(accessToken, activity.id)
        activityDetails.zones = await fetchActivityZones(accessToken, activity.id)
        console.log(activityDetails)
        return activityDetails;
    } catch (error) {
        console.error('Error fetching activity details:', error);
        throw error;
    }
};


const fetchActivityStreams = async (accessToken, activityId) => {
    try {
        const response = await fetch(`https://www.strava.com/api/v3/activities/${activityId}/streams?keys=time,distance,altitude,heartrate,cadence,watts`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch activity streams');
        }

        const activityStreams = await response.json();

        return activityStreams;
    } catch (error) {
        console.error('Error fetching activity streams:', error);
        throw error;
    }
};

const fetchActivityZones = async (accessToken, activityId) => {
    try {
        const response = await fetch(`https://www.strava.com/api/v3/activities/${activityId}/zones`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch activity zones');
        }

        const activityZones = await response.json();

        return activityZones;
    } catch (error) {
        console.error('Error fetching activity zones:', error);
        throw error;
    }
};
