import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import PageLayout from "@/components/common/PageLayout";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import Input from "@/components/common/Form/Input";
import Button from "@/components/common/Button/Button";
import styles from './MySchedule.module.scss';
import FormRow from "@/components/common/Form/FormRow";

interface Todo {
    id: string;
    content: string;
    date: string;
    is_completed: boolean;
}

const MySchedule = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [content, setContent] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    /* 조회 */
    const fetchTodos = async () => {
        const {data: {user}} = await supabase.auth.getUser();
        if (!user) return;

        const {data} = await supabase
            .from('personal_schedules')
            .select('*')
            .eq('user_id', user.id)
            .order('date', {ascending: true}) /* 날짜 순 */
            .order('created_at', {ascending: true}) /* 만든 순 */

        if(data) setTodos(data);
    };

    useEffect(() => {
        fetchTodos();
    },[]);

    /* 추가 */
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const {data: {user}} = await supabase.auth.getUser();
        if (!user || !content) return;

        const {error} = await supabase.from('personal_schedules').insert([
            {
                user_id: user.id,
                content: content,
                date: date,
                is_completed: false
            }
        ]);
        if(!error) {
            setContent('') /* 입력창 비우기 */
            fetchTodos(); /* 목록갱신 */
        }
    };

    /* 수정 (Update)- 완료 토글 */
    const toggleComplete = async (id: string, currentStatus: boolean) => {
        await supabase
            .from('personal_schedules')
            .update({ is_completed: !currentStatus })
            .eq('id', id);
        
        fetchTodos();
    };

    /* 삭제 */
    const handleDelete = async (id: string) => {
        if (!confirm('삭제하시겠습니까?')) return;
        await supabase.from('personal_schedules').delete().eq('id', id);
        fetchTodos();
    };

    return (
        <PageLayout>
            <PageHeader title="나의 일정" description="개인적인 업무와 할 일을 관리합니다." />

            
                {/* 
                   🚀 [핵심 변경] 
                   1. ratio="1fr 150px 100px" -> 내용(가변) : 날짜(고정) : 버튼(고정)
                   2. 다크 모드니까 className={styles.inputArea} 제거하고 바로 FormRow 사용
                   3. 다크 모드니까 Input에 className={darkInput} 줄 필요 없음 (기본이 다크)
                */}
                <form onSubmit={handleAdd}>
                    <FormRow ratio="1fr 150px 100px">
                        <Input 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder="할 일을 입력하세요" 
                        />
                        <Input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                        />
                        {/* 버튼은 라벨이 없어서 높이가 안 맞을 수 있으니 div로 감싸거나 스타일 조정 */}
                        <div style={{ paddingBottom: '2px' }}> 
                            <Button type="submit" variant="primary" fullWidth>추가</Button>
                        </div>
                    </FormRow>
                </form>

                {/* 리스트 영역 */}
                <ul className={styles.todoList}>
                    {todos.map(todo => (
                        <li key={todo.id} className={`${styles.todoItem} ${todo.is_completed ? styles.done : ''}`}>
                            <div className={styles.checkGroup} onClick={() => toggleComplete(todo.id, todo.is_completed)}>
                                <input 
                                    type="checkbox" 
                                    checked={todo.is_completed} 
                                    readOnly 
                                />
                                <span className={styles.text}>{todo.content}</span>
                                <span className={styles.date}>{todo.date}</span>
                            </div>
                            <button className={styles.deleteBtn} onClick={() => handleDelete(todo.id)}>
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
        </PageLayout>
    );
};

export default MySchedule;


