export const insertNewLap = (activity, newLapStart, newLapEnd, parentLapIndex = 1) => {
    const beforeNewLap = calcNewLapValues(activity, 0, newLapStart - 1, 0)
    const newLap = calcNewLapValues(activity, newLapStart, newLapEnd, 1)
    const afterNewLap = calcNewLapValues(activity, newLapEnd, activity.elapsed_time, 1)
    // Call calcNewLapValues
    // before lapStart (if applicable)
    // for lapStart to lapEnd 
    // for after lapEnd (if applicable)
    return [beforeNewLap, newLap, afterNewLap]
}

export const calcNewLapValues = (parentActivity, newLapStart, newLapEnd, parentLapIndex) => {
    console.log(newLapStart, newLapEnd)
    const powerStream = parentActivity.streams.filter((stream) => stream.type === 'watts')[0].data.slice(newLapStart, newLapEnd + 1)
    const average_watts = powerStream.reduce((a, b) => a + b) / powerStream.length

    return {
        average_watts: average_watts,
        elapspsed_time: newLapEnd - newLapStart,
        start_index: newLapStart,
        end_index: newLapEnd,
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