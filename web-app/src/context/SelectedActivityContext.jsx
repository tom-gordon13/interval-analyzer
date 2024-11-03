import React, { createContext, useState } from 'react';

export const SelectedActivityContext = createContext();

export const SelectedActivityProvider = ({ children }) => {
    const [selectedActivity, setSelectedActivity] = useState(null)

    return (
        <SelectedActivityContext.Provider value={{ selectedActivity, setSelectedActivity }}>
            {children}
        </SelectedActivityContext.Provider>
    );
};