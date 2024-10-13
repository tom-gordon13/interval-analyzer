import './activity-card.css';
import React, { useState } from 'react';
import { formatSecondsToTime } from '../utils/time-conversion-helpers';
import { convertMetersToMappedDistance, distanceConversionMap } from '../utils/distance-conversion-helpers';

export function ActivityTypeSummary({
    activityType,
    activitySet
}) {



    return (
        <div className="ActivityTypeSummary">
            {activityType}
            <br />
            {formatSecondsToTime(activitySet.totalTime)}
            <br />
            {activitySet.numActivities} activities
            <br />
            {convertMetersToMappedDistance(activitySet.totalDistance, activityType).toFixed(1)} {distanceConversionMap[activityType]}

        </div>
    );
}