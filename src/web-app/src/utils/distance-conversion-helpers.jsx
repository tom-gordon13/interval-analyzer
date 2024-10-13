export const distanceConversionMap = {
    'Swim': 'yards',
    'Ride': 'miles',
    'VirtualRide': 'miles',
    'Run': 'miles'
}

export function convertMetersToMappedDistance(meters, activityType) {
    // Check if the provided activity type exists in the mapping
    if (distanceConversionMap.hasOwnProperty(activityType)) {
        const conversionFactor = {
            'meters': 1,       // Conversion factor for meters
            'yards': 1.09361,  // Conversion factor for meters to yards
            'miles': 0.000621371 // Conversion factor for meters to miles
        };

        // Calculate the converted distance based on the activity type
        const convertedDistance = meters * conversionFactor[distanceConversionMap[activityType]];

        return convertedDistance;
    } else {
        // If the provided activity type is not found in the mapping, return an error message
        return `Unsupported activity type: ${activityType}`;
    }
}