import axios from 'axios';

const serverPort = 3000

export const fetchActivityBasic = async (userId, quantity, accessToken) => {
    try {
        const response = await axios.get(
            `http://localhost:${serverPort}/user/${userId}/activity-basic/`,
            { quantity: quantity },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        const data = response.data;
        console.log(`${quantity} activit${quantity > 1 ? 'ies' : 'y'} fetched successfully:`, data);
        return data;
    } catch (error) {
        // Handle errors
        console.error('Error upserting activity:', error.response?.data?.message || error.message);
    }
};