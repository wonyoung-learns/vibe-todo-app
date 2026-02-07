import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabaseClient'

interface Todo {
    id: string;
    task: string;
    is_completed: boolean;
    created_at: string;
    parent_id?: string;
    deadline?: string;
}

function App() {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const saved = localStorage.getItem('vibe_todos')
        return saved ? JSON.parse(saved) : []
    })
    const [newTask, setNewTask] = useState('')
    const [newDeadline, setNewDeadline] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('vibe_session') === 'true'
    })

    useEffect(() => {
        localStorage.setItem('vibe_todos', JSON.stringify(todos))
    }, [todos])

    useEffect(() => {
        localStorage.setItem('vibe_session', String(isLoggedIn))
    }, [isLoggedIn])

    const handleLogin = () => setIsLoggedIn(true)
    const handleLogout = () => setIsLoggedIn(false)

    const addTodo = (e: React.FormEvent, parent_id?: string) => {
        e.preventDefault()
        if (!newTask.trim()) return
        const todo: Todo = {
            id: Math.random().toString(36).substr(2, 9),
            task: newTask,
            is_completed: false,
            created_at: new Date().toISOString(),
            parent_id,
            deadline: newDeadline || undefined
        }
        setTodos([todo, ...todos])
        setNewTask('')
        setNewDeadline('')
    }

    const toggleTodo = (id: string) => {
        const updateCompletion = (list: Todo[], targetId: string): Todo[] => {
            return list.map((t: Todo) => {
                if (t.id === targetId) {
                    return { ...t, is_completed: !t.is_completed }
                }
                return t
            })
        }
        setTodos(updateCompletion(todos, id))
    }

    const deleteTodo = (id: string) => {
        // Delete item and all its subtasks
        setTodos(todos.filter((t: Todo) => t.id !== id && t.parent_id !== id))
    }

    if (!isLoggedIn) {
        return (
            <main className="glass" style={{ padding: '2rem', width: '400px', textAlign: 'center' }}>
                <h1 className="title">VIBE TODO</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Experience the ultimate productivity vibe.</p>
                <button
                    onClick={handleLogin}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'linear-gradient(to right, #00f2ff, #ff00c8)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}
                >
                    GET STARTED
                </button>
            </main>
        )
    }

    return (
        <main className="glass" style={{ padding: '2rem', width: '500px', minHeight: '600px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>VIBE TODO</h1>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                    <LogOut size={20} />
                </button>
            </header>

            <form onSubmit={addTodo} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
                        placeholder="What's your next vibe?"
                        style={{
                            flex: 1,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '0.8rem 1rem',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            background: 'var(--accent-blue)',
                            border: 'none',
                            borderRadius: '12px',
                            width: '45px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'black'
                        }}
                    >
                        <Plus size={24} />
                    </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 5px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        Deadline:
                        <input
                            type="date"
                            value={newDeadline}
                            onChange={(e) => setNewDeadline(e.target.value)}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '6px',
                                color: 'white',
                                padding: '2px 5px',
                                outline: 'none'
                            }}
                        />
                    </label>
                </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence>
                    {todos.filter(t => !t.parent_id).map((todo: Todo) => (
                        <div key={todo.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass"
                                style={{
                                    padding: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    border: '1px solid var(--glass-border)'
                                }}
                            >
                                <button
                                    onClick={() => toggleTodo(todo.id)}
                                    style={{ background: 'none', border: 'none', color: todo.is_completed ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
                                >
                                    {todo.is_completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                                </button>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <span style={{
                                        textDecoration: todo.is_completed ? 'line-through' : 'none',
                                        color: todo.is_completed ? 'var(--text-secondary)' : 'white'
                                    }}>
                                        {todo.task}
                                    </span>
                                    {todo.deadline && (
                                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-pink)', opacity: 0.8 }}>
                                            Due: {new Date(todo.deadline).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    style={{ background: 'none', border: 'none', color: '#ff4b4b' }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </motion.div>

                            {/* Subtasks */}
                            <div style={{ paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {todos.filter((st: Todo) => st.parent_id === todo.id).map((subtask: Todo) => (
                                    <motion.div
                                        key={subtask.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="glass"
                                        style={{
                                            padding: '0.6rem 0.8rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            fontSize: '0.9rem',
                                            opacity: 0.9
                                        }}
                                    >
                                        <button
                                            onClick={() => toggleTodo(subtask.id)}
                                            style={{ background: 'none', border: 'none', color: subtask.is_completed ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
                                        >
                                            {subtask.is_completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                                        </button>
                                        <span style={{ flex: 1, textDecoration: subtask.is_completed ? 'line-through' : 'none' }}>
                                            {subtask.task}
                                        </span>
                                        <button onClick={() => deleteTodo(subtask.id)} style={{ background: 'none', border: 'none', color: '#ff4b4b' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                                {/* Inline Add Subtask */}
                                <div style={{ display: 'flex', gap: '8px', padding: '0 5px' }}>
                                    <input
                                        type="text"
                                        placeholder="Add sub-vibe..."
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                const val = e.currentTarget.value;
                                                e.currentTarget.value = '';
                                                const sub: Todo = {
                                                    id: Math.random().toString(36).substr(2, 9),
                                                    task: val,
                                                    is_completed: false,
                                                    created_at: new Date().toISOString(),
                                                    parent_id: todo.id
                                                };
                                                setTodos([...todos, sub]);
                                            }
                                        }}
                                        style={{
                                            flex: 1,
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px dashed var(--glass-border)',
                                            borderRadius: '8px',
                                            padding: '0.4rem 0.8rem',
                                            fontSize: '0.8rem',
                                            color: 'white',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </main>
    )
}

export default App
