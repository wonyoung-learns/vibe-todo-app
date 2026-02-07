import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Check, LogOut, Calendar, Clock, CheckSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
    const [deadline, setDeadline] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('vibe_session') === 'true'
    })

    useEffect(() => {
        localStorage.setItem('vibe_todos', JSON.stringify(todos))
    }, [todos])

    useEffect(() => {
        localStorage.setItem('vibe_session', String(isLoggedIn))
    }, [isLoggedIn])

    const addTodo = (parent_id?: string, specificTask?: string) => {
        const taskText = specificTask || newTask
        if (!taskText.trim()) return

        const todo: Todo = {
            id: Math.random().toString(36).substr(2, 9),
            task: taskText,
            is_completed: false,
            created_at: new Date().toISOString(),
            parent_id,
            deadline: parent_id ? undefined : (deadline || undefined)
        }

        setTodos([todo, ...todos])
        if (!parent_id) {
            setNewTask('')
            setDeadline('')
        }
    }

    const toggleTodo = (id: string) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, is_completed: !t.is_completed } : t))
    }

    const deleteTodo = (id: string) => {
        setTodos(prev => prev.filter(t => t.id !== id && t.parent_id !== id))
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-white/30 p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card max-w-md w-full p-10 rounded-[32px] text-center"
                >
                    <h1 className="title-outfit text-5xl font-bold bg-gradient-to-br from-vibe-primary via-vibe-secondary to-vibe-accent bg-clip-text text-transparent mb-4">
                        VIBE TODO
                    </h1>
                    <p className="text-slate-500 mb-8 font-medium italic">Elevate your productivity with a modern vibe.</p>
                    <button
                        onClick={() => setIsLoggedIn(true)}
                        className="w-full py-4 px-6 bg-vibe-primary text-white rounded-2xl font-semibold shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5"
                    >
                        Get Started
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-transparent p-4 md:p-8 lg:p-12 flex justify-center items-start">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Header Section - Bento Card 1 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-12 glass-card p-6 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-vibe-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <CheckSquare size={24} />
                        </div>
                        <div>
                            <h1 className="title-outfit text-2xl font-bold text-slate-800 leading-none">VIBE TODO</h1>
                            <p className="text-sm text-slate-400 font-medium tracking-tight mt-1">Design your productivity</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsLoggedIn(false)}
                        className="flex items-center gap-2 group px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500 font-medium"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Logout
                    </button>
                </motion.div>

                {/* Input Section - Bento Card 2 */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-4 glass-card p-8 rounded-[32px] lg:sticky lg:top-8"
                >
                    <h2 className="title-outfit text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-vibe-secondary rounded-full"></span>
                        Create Vibe
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Task Description</label>
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="What's your next vibe?"
                                className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-vibe-primary/10 focus:border-vibe-primary transition-all text-slate-700 placeholder:text-slate-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Deadline Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="w-full p-4 pl-12 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-vibe-primary/10 focus:border-vibe-primary transition-all text-slate-700 appearance-none"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => addTodo()}
                            className="w-full p-4 bg-vibe-primary text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            <Plus size={20} />
                            Add to List
                        </button>
                    </div>
                </motion.div>

                {/* Todo List Section - Bento Card 3 */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-8 glass-card p-8 rounded-[32px]"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="title-outfit text-xl font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-6 bg-vibe-accent rounded-full"></span>
                            Your Vibes
                        </h2>
                        <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-400">
                            {todos.filter(t => !t.parent_id).length} Active
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence>
                            {todos.filter(todo => !todo.parent_id).map(todo => (
                                <motion.div
                                    key={todo.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-4 rounded-2xl bg-white/40 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col gap-3"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <button
                                                onClick={() => toggleTodo(todo.id)}
                                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${todo.is_completed
                                                        ? "bg-vibe-accent border-vibe-accent text-white"
                                                        : "border-slate-200 hover:border-vibe-accent text-transparent"
                                                    }`}
                                            >
                                                <Check size={14} />
                                            </button>
                                            <div className="flex flex-col min-w-0">
                                                <span className={`text-base font-semibold truncate ${todo.is_completed ? "text-slate-300 line-through" : "text-slate-700"}`}>
                                                    {todo.task}
                                                </span>
                                                {todo.deadline && (
                                                    <span className="text-[10px] font-bold text-vibe-secondary uppercase flex items-center gap-1 mt-0.5">
                                                        <Clock size={10} />
                                                        Deadline: {new Date(todo.deadline).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="p-2 text-slate-200 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Subtasks Section */}
                                    <div className="ml-10 space-y-2 border-l-2 border-slate-100/50 pl-4 py-1">
                                        {todos.filter(sub => sub.parent_id === todo.id).map(subtask => (
                                            <div key={subtask.id} className="flex items-center justify-between gap-3 group/sub">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => toggleTodo(subtask.id)}
                                                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${subtask.is_completed
                                                                ? "bg-slate-300 border-slate-300 text-white"
                                                                : "border-slate-200 hover:border-slate-300 shadow-sm"
                                                            }`}
                                                    >
                                                        <Check size={10} />
                                                    </button>
                                                    <span className={`text-sm font-medium ${subtask.is_completed ? "text-slate-300 line-through font-normal" : "text-slate-500"}`}>
                                                        {subtask.task}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => deleteTodo(subtask.id)}
                                                    className="p-1 text-slate-200 hover:text-red-400 opacity-0 group-hover/sub:opacity-100 transition-all font-medium"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-2 mt-2">
                                            <input
                                                type="text"
                                                placeholder="Add sub-vibe..."
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                                                        addTodo(todo.id, (e.target as HTMLInputElement).value)
                                                            ; (e.target as HTMLInputElement).value = ''
                                                    }
                                                }}
                                                className="flex-1 text-sm py-1 px-3 bg-slate-50/50 rounded-lg focus:outline-none focus:bg-slate-50 text-slate-500 placeholder:text-slate-300 border border-transparent focus:border-slate-100 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {todos.filter(t => !t.parent_id).length === 0 && (
                            <div className="h-64 flex flex-col items-center justify-center text-slate-200 gap-3 border-2 border-dashed border-slate-50 rounded-[32px]">
                                <CheckSquare size={48} strokeWidth={1} />
                                <p className="font-semibold text-slate-300">No vibes yet. Start creating!</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default App
