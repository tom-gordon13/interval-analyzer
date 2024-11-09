
const typeList = [
    'Swim',
    'Run',
    'Ride',
    'VirtualRide'
]

const totalFieldSum = (activities, field) => {
    return activities.reduce((accumulator, activity) => {
        return accumulator + activity[field]
    }, 0)
}

export const formatActivities = (activities) => {
    const activityObject = {}
    typeList.forEach(type => {
        const currType = activities.filter((activity) => {
            return activity.sport_type === type
        })
        activityObject[type] = {
            numActivities: currType.length,
            totalTime: totalFieldSum(currType, 'moving_time'),
            totalDistance: totalFieldSum(currType, 'distance')
        }
    })
    return activityObject
}