export const insertNewLap = (activity, newLapStart, newLapEnd, parentLapIndex = 1) => {
    const beforeNewLap = calcNewLapValues(activity, 0, newLapStart - 1, 0)
    const newLap = calcNewLapValues(activity, newLapStart, newLapEnd, 1)
    const afterNewLap = calcNewLapValues(activity, newLapEnd, activity.elapsed_time, 2)
    // Call calcNewLapValues
    // before lapStart (if applicable)
    // for lapStart to lapEnd 
    // for after lapEnd (if applicable)
    return { ...activity, laps: [beforeNewLap, newLap, afterNewLap] }
}

export const calcNewLapValues = (parentActivity, newLapStart, newLapEnd, parentLapIndex) => {
    const powerStream = parentActivity.streams.filter((stream) => stream.type === 'watts')[0].data.slice(newLapStart, newLapEnd + 1)
    const average_watts = powerStream.reduce((a, b) => a + b) / powerStream.length

    return {
        average_watts: Math.round(average_watts),
        elapsed_time: Math.round(newLapEnd - newLapStart),
        start_index: Math.round(newLapStart),
        end_index: Math.round(newLapEnd),
        id: null,
        lap_index: parentLapIndex
    }
}


// average_watts xxx
// elapsed_time xxx
// start_index xxx
// end_index xxx
// id
// lap_index

// distance(later)
// average_cadence(later)
// average_speed(later)
// max_speed(later)