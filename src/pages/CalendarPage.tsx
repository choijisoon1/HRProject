import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import PageLayout from '@/components/common/PageLayout';
import AddSchedulePopup from '@/components/calendar/AddSchedulePopup';

const CalendarPage = () => {
    const [date, setDate] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);

    return (
        <PageLayout>
            <Calendar
                onClickDay={date => {
                    setIsOpen(true);
                    setDate(date);
                }}
            />
            {isOpen && <AddSchedulePopup date={date} setIsOpen={setIsOpen} />}
        </PageLayout>
    );
};

export default CalendarPage;
