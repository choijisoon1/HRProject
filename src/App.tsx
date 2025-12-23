// src/App.tsx
import { useEffect, useState } from 'react'
import { supabase } from './api/supabaseClient'

function App() {
  const [status, setStatus] = useState('연결 확인 중...')

  useEffect(() => {
    //Supabase 연결 테스트
    const checkConnection = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('에러 발생:', error)
        setStatus('연결 실패 콘솔 확인')
      } else {
        console.log('Supabase 응답:', data)
        setStatus('Supabase 연결 성공!')
      }
    }

    checkConnection()
  }, [])

  return (
    <div style={{ padding: '50px' }}>
      <h1>HR 시스템</h1>
      <h2>상태: {status}</h2>
    </div>
  )
}

export default App