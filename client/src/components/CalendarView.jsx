import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar.css'; 

function CalendarView({ workouts, onDateChange }) {
    const [value, setValue] = useState(new Date());

    const workoutDates = workouts.map(w =>
        new Date(w.createdAt).toDateString()
    );

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toDateString();
            if (workoutDates.includes(dateString)) {
                return <div className="dot"></div>;
            }
        }
    };

    const handleDateClick = (date) => {
        setValue(date);
        if (onDateChange) onDateChange(date);
    };

    return (
        <div className="calendar-container">
            <h3 className="section-title">Attendance</h3>
            <Calendar
                onChange={handleDateClick}
                value={value}
                tileContent={tileContent}
                formatDay={(locale, date) => date.getDate()}
            />
        </div>
    );
}

export default CalendarView;