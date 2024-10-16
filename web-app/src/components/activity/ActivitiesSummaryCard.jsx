import '../../styles/activities-summary-card.css';
import '../../../node_modules/react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { ActivityTypeSummary } from './ActivityTypeSummary'
import { Button } from '@mui/material';


const ActivitiesSummaryCard = ({
    activities,
    handleActivitiesSummaryClick,
    startDate,
    endDate,
    handleDateChange,
    activityObj
}) => {
    return (
        <div className="activity-summary">
            <div className='date-container'>
                <div className='date-pick-box'>
                    <h5 className='date-pick-header text-center'>Start Date</h5>
                    <DatePicker className='m-2 text-black' selected={startDate} onChange={(date) => handleDateChange(date, 'start')} />

                </div>
                <div className='date-pick-box'>
                    <h5 className='date-pick-header text-center'>End Date</h5>
                    <DatePicker className='m-2 text-black' selected={endDate} onChange={(date) => handleDateChange(date, 'end')} />

                </div>
            </div>
            <br />
            <Button
                variant="contained"
                onClick={handleActivitiesSummaryClick}
            >
                Confirm Date Window
            </Button>
            <br />
            {activities.length ? (<div>Number of Activities: {activities.length}</div>) : ''}
            <div className='activity-types-container flex justify-between'>
                {activityObj && activities.length ?
                    Object.keys(activityObj).map((activityType, index) => (
                        <ActivityTypeSummary
                            key={`${activityType}-${index}`}
                            activityType={activityType}
                            activitySet={activityObj[activityType]} />
                    ))
                    : ''}
            </div>
        </div>
    );
}

export default ActivitiesSummaryCard;