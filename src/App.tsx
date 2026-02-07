import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabaseClient'

interface Todo {
    id: string;
    task: string;
    is_completed: boolean;
    created_at: string;
}

function App() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [newTask, setNewTask] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Simulation: Since placeholders are used, we'll manually toggle auth for demo
    const handleLogin = () => setIsLoggedIn(true)
    const handleLogout = () => setIsLoggedIn(false)

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTask.trim()) return
        const todo: Todo = {
            id: Math.random().toString(36).substr(2, 9),
            task: newTask,
            is_completed: false,
            created_at: new Date().toISOString()
        }
        setTodos([todo, ...todos])
        setNewTask('')
    }

    const toggleTodo = (id: string) => {
        setTodos(todos.map(t => t.id === id ? { ...t, is_completed: !t.is_completed } : t))
    }

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(t => t.id !== id))
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

            <form onSubmit={addTodo} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
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
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence>
                    {todos.map(todo => (
                        <motion.div
                            key={todo.id}
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
                            <span style={{
                                flex: 1,
                                textDecoration: todo.is_completed ? 'line-through' : 'none',
                                color: todo.is_completed ? 'var(--text-secondary)' : 'white'
                            }}>
                                {todo.task}
                            </span>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                style={{ background: 'none', border: 'none', color: '#ff4b4b' }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </main>
    )
}

export default App
