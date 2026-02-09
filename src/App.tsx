import { useState, useEffect } from 'react'
import {
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Check } from "lucide-react"

import { Todo, SortOption, View } from "@/types/todo"
import { AddTaskForm } from "@/components/todo/add-task-form"
import { TaskList } from "@/components/todo/task-list"
import { TodoHeader } from "@/components/todo/todo-header"
import { TaskDetailsSheet } from "@/components/todo/task-details"

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('vibe_session') === 'true'
    })

    const [todos, setTodos] = useState<Todo[]>(() => {
        const saved = localStorage.getItem('vibe_todos')
        return saved ? JSON.parse(saved) : []
    })

    const [currentView, setCurrentView] = useState<View>('inbox')
    const [sortOrder, setSortOrder] = useState<SortOption>('created_desc')
    const [selectedTask, setSelectedTask] = useState<Todo | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    // Persistence
    useEffect(() => {
        localStorage.setItem('vibe_todos', JSON.stringify(todos))
    }, [todos])

    useEffect(() => {
        localStorage.setItem('vibe_session', String(isLoggedIn))
    }, [isLoggedIn])

    // Actions
    const addTodo = (taskText: string, taskDeadline?: Date) => {
        const todo: Todo = {
            id: Math.random().toString(36).substr(2, 9),
            task: taskText,
            is_completed: false,
            created_at: new Date().toISOString(),
            parent_id: undefined,
            deadline: taskDeadline ? taskDeadline.toISOString().split('T')[0] : (currentView === 'today' ? new Date().toISOString().split('T')[0] : undefined),
            description: "",
            priority: undefined
        }

        setTodos([todo, ...todos])
        toast.success("Task added successfully")
    }

    const updateTodo = (id: string, updates: Partial<Todo>) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))

        // Update selected task if it's the one being modified
        if (selectedTask?.id === id) {
            setSelectedTask(prev => prev ? { ...prev, ...updates } : null)
        }
    }

    const toggleTodo = (id: string) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, is_completed: !t.is_completed } : t))
    }

    const deleteTodo = (id: string) => {
        setTodos(prev => prev.filter(t => t.id !== id && t.parent_id !== id))
        if (selectedTask?.id === id) {
            setIsSheetOpen(false)
            setSelectedTask(null)
        }
        toast.message("Task deleted")
    }

    const handleSelectTask = (todo: Todo) => {
        setSelectedTask(todo)
        setIsSheetOpen(true)
    }

    // Filtering & Sorting
    const sortTodos = (todos: Todo[]) => {
        return [...todos].sort((a, b) => {
            switch (sortOrder) {
                case 'created_desc':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                case 'created_asc':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                case 'deadline_asc':
                    if (!a.deadline) return 1
                    if (!b.deadline) return -1
                    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
                case 'alphabetical':
                    return a.task.localeCompare(b.task)
                default:
                    return 0
            }
        })
    }

    const filterTodos = () => {
        const rootTodos = todos.filter(t => !t.parent_id)
        let filtered = rootTodos

        if (currentView === 'today') {
            const today = new Date().toISOString().split('T')[0]
            filtered = rootTodos.filter(t => t.deadline === today)
        } else if (currentView === 'upcoming') {
            const today = new Date().toISOString().split('T')[0]
            filtered = rootTodos.filter(t => t.deadline && t.deadline > today)
        }

        return sortTodos(filtered)
    }

    const todoCounts = {
        inbox: todos.filter(t => !t.parent_id).length,
        today: todos.filter(t => !t.parent_id && t.deadline === new Date().toISOString().split('T')[0]).length,
        upcoming: todos.filter(t => !t.parent_id && t.deadline && t.deadline > new Date().toISOString().split('T')[0]).length
    }

    // Login Screen
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
                <Card className="w-full max-w-md p-8 shadow-lg">
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                            <Check className="size-8" strokeWidth={3} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Todoist v2</h1>
                            <p className="text-muted-foreground">Organize your work and life, finally.</p>
                        </div>
                        <Button
                            size="lg"
                            className="w-full font-semibold text-base h-12"
                            onClick={() => setIsLoggedIn(true)}
                        >
                            Get Started
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar
                currentView={currentView}
                setCurrentView={setCurrentView}
                setIsLoggedIn={setIsLoggedIn}
                todoCounts={todoCounts}
            />
            <SidebarInset>
                <TodoHeader
                    currentView={currentView}
                    sortOrder={sortOrder}
                    onSortChange={setSortOrder}
                />

                <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 max-w-4xl mx-auto w-full">
                    <AddTaskForm onAdd={addTodo} />

                    <TaskList
                        todos={todos}
                        visibleTodos={filterTodos()}
                        currentView={currentView}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onSelect={handleSelectTask}
                    />
                </div>

                <TaskDetailsSheet
                    todo={selectedTask}
                    isOpen={isSheetOpen}
                    onClose={() => setIsSheetOpen(false)}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                />
            </SidebarInset>
            <Toaster />
        </SidebarProvider>
    )
}
