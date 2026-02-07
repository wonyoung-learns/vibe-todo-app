import React, { useState, useEffect } from 'react'
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
            <main className="glass p-8 w-[400px] text-center">
                <h1 className="title">VIBE TODO</h1>
                <p className="text-gray-400 mb-8">Experience the ultimate productivity vibe.</p>
                <button
                    onClick={handleLogin}
                    className="w-full p-4 bg-vibe-gradient rounded-xl text-white font-bold text-lg hover:opacity-90 transition-opacity"
                >
                    GET STARTED
                </button>
            </main>
        )
    }

    return (
        <main className="glass p-10 w-[550px] min-h-[700px] shadow-2xl transition-all duration-300">
            <header className="flex justify-between items-center mb-10">
                <h1 className="title !text-3xl !mb-0 !leading-tight">VIBE TODO</h1>
                <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
                    title="Logout"
                >
                    <LogOut size={22} />
                </button>
            </header>

            <form onSubmit={addTodo} className="flex flex-col gap-4 mb-10">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
                        placeholder="What's your next vibe?"
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-vibe-blue/50 focus:ring-1 focus:ring-vibe-blue/30 transition-all placeholder:text-gray-500"
                    />
                    <button
                        type="submit"
                        className="bg-vibe-blue rounded-2xl w-[60px] flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-vibe-blue/20"
                    >
                        <Plus size={28} />
                    </button>
                </div>
                <div className="flex items-center gap-3 px-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2 cursor-pointer group">
                        <span className="group-hover:text-vibe-pink transition-colors">Deadline:</span>
                        <input
                            type="date"
                            value={newDeadline}
                            onChange={(e) => setNewDeadline(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs outline-none focus:border-vibe-pink/50 transition-all cursor-pointer invert opacity-80 hover:opacity-100"
                        />
                    </label>
                </div>
            </form>

            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                    {todos.filter(t => !t.parent_id).map((todo: Todo) => (
                        <div key={todo.id} className="flex flex-col gap-3 group">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`glass p-5 flex items-center gap-4 border border-white/5 hover:border-white/20 transition-all duration-300 shadow-lg ${todo.is_completed ? 'opacity-60' : ''}`}
                            >
                                <button
                                    onClick={() => toggleTodo(todo.id)}
                                    className={`transition-all duration-300 transform hover:scale-110 ${todo.is_completed ? 'text-vibe-blue' : 'text-gray-500'}`}
                                >
                                    {todo.is_completed ? <CheckCircle size={26} className="filter drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]" /> : <Circle size={26} />}
                                </button>
                                <div className="flex-1 flex flex-col">
                                    <span className={`text-lg transition-all duration-300 ${todo.is_completed ? 'line-through text-gray-500' : 'text-white'}`}>
                                        {todo.task}
                                    </span>
                                    {todo.deadline && (
                                        <span className="text-[11px] font-mono tracking-wider text-vibe-pink/80 mt-1 uppercase">
                                            // D-DATE: {new Date(todo.deadline).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <Trash2 size={22} />
                                </button>
                            </motion.div>

                            {/* Subtasks */}
                            <div className="pl-12 flex flex-col gap-3">
                                {todos.filter((st: Todo) => st.parent_id === todo.id).map((subtask: Todo) => (
                                    <motion.div
                                        key={subtask.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`glass px-4 py-3 flex items-center gap-3 text-sm border border-white/5 hover:border-white/10 transition-all ${subtask.is_completed ? 'opacity-50' : ''}`}
                                    >
                                        <button
                                            onClick={() => toggleTodo(subtask.id)}
                                            className={`transition-all ${subtask.is_completed ? 'text-vibe-blue' : 'text-gray-500'}`}
                                        >
                                            {subtask.is_completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                                        </button>
                                        <span className={`flex-1 transition-all ${subtask.is_completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                                            {subtask.task}
                                        </span>
                                        <button
                                            onClick={() => deleteTodo(subtask.id)}
                                            className="text-gray-600 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                                {/* Inline Add Subtask */}
                                <div className="flex gap-2 px-1 mt-1">
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
                                        className="flex-1 bg-white/[0.02] border border-dashed border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-vibe-blue/30 placeholder:text-gray-600 transition-all focus:bg-white/[0.05]"
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
