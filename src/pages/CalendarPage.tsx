import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import AddSchedulePopup from '@/components/calendar/AddSchedulePopup';

const CalendarPage = () => {
    const [date, setDate] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Calendar
                onClickDay={date => {
                    setIsOpen(true);
                    setDate(date);
                }}
            />
            {isOpen && <AddSchedulePopup date={date} setIsOpen={setIsOpen} />}
        </>
    );
};

export default CalendarPage;
