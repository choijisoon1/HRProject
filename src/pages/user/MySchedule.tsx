import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/api/supabaseClient";
import PageLayout from "@/components/common/PageLayout";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import Input from "@/components/common/Form/Input";
import Button from "@/components/common/Button/Button";
import styles from './MySchedule.module.scss';
import FormRow from "@/components/common/Form/FormRow";
import Form from "@/components/common/Form/Form";
import Textarea from '../../components/common/Form/Textarea'

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
            setContent(''); /* 입력창 비우기 */
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

    /* 날짜별 그룹핑 */
    const groupedTodos = useMemo(() => {
        const groups: { [key: string]: Todo[] } = {};
        
        todos.forEach(todo => {
            if (!groups[todo.date]) {
                groups[todo.date] = [];
            }
            groups[todo.date].push(todo);
        });

        /* 날짜순 정렬 */
        return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
    }, [todos]);

    return (
        <PageLayout>
            <PageHeader title="나의 일정" description="개인적인 업무와 할 일을 관리합니다." />

            {/* 입력 폼 */}
            <div style={{ marginBottom: '40px' }}>
                <Form onSubmit={handleAdd}>
                    <Textarea 
                        value={content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)} 
                        placeholder="할 일을 입력하세요 (예: 3시 미팅 준비)" 
                        rows={3}
                    />
                    
                    {/* 
                        ratio="1fr px px" -> 내용(가변) : 날짜(고정) : 버튼(고정)
                    */}
                    <FormRow ratio="1fr 200px 100px">
                        <div></div>
                        <Input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                        />
                        <Button type="submit" variant="primary" fullWidth>추가</Button>
                    </FormRow>
                </Form>
            </div>

            {/* 리스트 영역 (카드 그리드) */}
            <div className={styles.cardGrid}>
                {groupedTodos.map(([dateKey, items]) => (
                    <div key={dateKey} className={styles.dateCard}>
                        {/* 카드 헤더 */}
                        <div className={styles.cardHeader}>
                            <h3>{new Date(dateKey).toLocaleDateString()}</h3>
                            <span className={styles.count}>{items.length}개</span>
                        </div>

                        {/* 카드 내부 리스트 */}
                        <ul className={styles.cardList}>
                            {items.map(todo => (
                                <li key={todo.id} className={`${styles.cardItem} ${todo.is_completed ? styles.done : ''}`}>
                                    <div className={styles.checkRow} onClick={() => toggleComplete(todo.id, todo.is_completed)}>
                                        <input 
                                            type="checkbox" 
                                            checked={todo.is_completed} 
                                            readOnly 
                                        />
                                        <span className={styles.text}>{todo.content}</span>
                                    </div>
                                    <button className={styles.miniDelete} onClick={() => handleDelete(todo.id)}>
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            
            {todos.length === 0 && (
                <p className={styles.emptyMsg}>등록된 일정이 없습니다.</p>
            )}
            
        </PageLayout>
    );
};

export default MySchedule;