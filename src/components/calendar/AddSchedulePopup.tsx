import { useState } from 'react';
import Button from '@/components/common/Button';
import Popup from '@/components/common/Popup';
import { supabase } from '@/api/supabaseClient';

function AddSchedulePopup({ date, setIsOpen }) {
    const [day, setDay] = useState(1);
    const [content, setContent] = useState(null);

    // 날짜 포맷 변경 함수
    const formatDate = date => date.toLocaleDateString().split('T')[0];

    // 수파베이스 데이터 삽입
    const handleAddEvent = async e => {
        e.preventDefault();
        const { error } = await supabase.from('schedule').insert([
            {
                date: date,
                user: '강민정',
                day: day,
                content: content,
            },
        ]);

        if (!error) {
            setIsOpen(false);
        }
    };

    return (
        <Popup>
            <form onSubmit={handleAddEvent}>
                <p>{formatDate(date)}</p>
                <fieldset>
                    <legend>연차/반차</legend>
                    <div>
                        <input
                            type="radio"
                            id="fullDay"
                            name="day"
                            value={1}
                            checked={day === 1}
                            onChange={() => setDay(1)}
                        />
                        <label htmlFor="fullDay">연차</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="halfDay"
                            name="day"
                            value={0.5}
                            checked={day === 0.5}
                            onChange={() => setDay(0.5)}
                        />
                        <label htmlFor="halfDay">반차</label>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>비고</legend>
                    <input
                        type="text"
                        onChange={e => setContent(e.target.value)}
                        placeholder="비고를 입력하세요"
                    />
                </fieldset>
                <Button variant="primary" type="submit">
                    추가
                </Button>
            </form>
        </Popup>
    );
}

export default AddSchedulePopup;
