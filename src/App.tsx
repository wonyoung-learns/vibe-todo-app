import { useState, useEffect } from 'react'
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
    SidebarSeparator
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Calendar as CalendarIcon, Check, Plus, Trash2, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Types
interface Todo {
    id: string;
    task: string;
    is_completed: boolean;
    created_at: string;
    parent_id?: string;
    deadline?: string;
}

type SortOption = 'created_desc' | 'created_asc' | 'deadline_asc' | 'alphabetical';

type View = 'inbox' | 'today' | 'upcoming';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('vibe_session') === 'true'
    })

    const [todos, setTodos] = useState<Todo[]>(() => {
        const saved = localStorage.getItem('vibe_todos')
        return saved ? JSON.parse(saved) : []
    })

    const [currentView, setCurrentView] = useState<View>('inbox')
    const [newTask, setNewTask] = useState('')
    const [deadline, setDeadline] = useState<Date | undefined>()
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [sortOrder, setSortOrder] = useState<SortOption>('created_desc')

    // Persistence
    useEffect(() => {
        localStorage.setItem('vibe_todos', JSON.stringify(todos))
    }, [todos])

    useEffect(() => {
        localStorage.setItem('vibe_session', String(isLoggedIn))
    }, [isLoggedIn])

    // Actions
    const addTodo = (parent_id?: string, specificTask?: string) => {
        const taskText = specificTask || newTask
        if (!taskText.trim()) return

        const todo: Todo = {
            id: Math.random().toString(36).substr(2, 9),
            task: taskText,
            is_completed: false,
            created_at: new Date().toISOString(),
            parent_id,
            deadline: parent_id ? undefined : (deadline ? deadline.toISOString().split('T')[0] : (currentView === 'today' ? new Date().toISOString().split('T')[0] : undefined))
        }

        setTodos([todo, ...todos])
        if (!parent_id) {
            setNewTask('')
            setDeadline(undefined)
            setIsAddingTask(false)
            toast.success("Task added successfully")
        }
    }

    const toggleTodo = (id: string) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, is_completed: !t.is_completed } : t))
    }

    const deleteTodo = (id: string) => {
        setTodos(prev => prev.filter(t => t.id !== id && t.parent_id !== id))
        toast.message("Task deleted")
    }

    // Filtering
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
                <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 z-10">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <h1 className="font-semibold text-lg capitalize">{currentView}</h1>
                        <span className="text-muted-foreground text-sm ml-2 font-normal hidden sm:inline">
                            {format(new Date(), 'EEE, MMM d')}
                        </span>
                    </div>
                    <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOption)}>
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="created_desc">Newest first</SelectItem>
                            <SelectItem value="created_asc">Oldest first</SelectItem>
                            <SelectItem value="deadline_asc">Deadline</SelectItem>
                            <SelectItem value="alphabetical">A-Z</SelectItem>
                        </SelectContent>
                    </Select>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 max-w-4xl mx-auto w-full">
                    {/* Add Task Input (Always visible at top or conditionally) */}
                    <div className="mb-2">
                        {!isAddingTask ? (
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-muted-foreground hover:text-primary gap-2 pl-0 py-6 h-auto"
                                onClick={() => setIsAddingTask(true)}
                            >
                                <div className="flex items-center justify-center size-6 rounded-full text-primary transition-colors">
                                    <Plus className="size-5" />
                                </div>
                                <span className="text-base font-medium">Add task</span>
                            </Button>
                        ) : (
                            <Card className="p-4 border-muted-foreground/20 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex flex-col gap-3">
                                    <Input
                                        autoFocus
                                        placeholder="Task name"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') addTodo()
                                            if (e.key === 'Escape') setIsAddingTask(false)
                                        }}
                                        className="border-none shadow-none focus-visible:ring-0 px-0 text-base font-medium placeholder:font-normal h-auto min-h-[auto]"
                                    />
                                    <div className="flex items-center justify-between border-t pt-3 mt-1">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="sm" className={cn("gap-2 h-8 font-normal", !deadline && "text-muted-foreground border-dashed")}>
                                                    <CalendarIcon className="size-3.5" />
                                                    {deadline ? format(deadline, "PPP") : "Due date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={deadline}
                                                    onSelect={setDeadline}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => setIsAddingTask(false)}>Cancel</Button>
                                            <Button size="sm" onClick={() => addTodo()} disabled={!newTask.trim()}>Add Task</Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>

                    <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
                        <div className="flex flex-col gap-1 pb-12">
                            {filterTodos().map(todo => (
                                <div key={todo.id} className="group relative">
                                    <div className="flex items-start gap-3 py-3 px-1 rounded-lg hover:bg-muted/40 transition-colors group/row">
                                        <Checkbox
                                            className="mt-1 rounded-full size-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary border-muted-foreground/30"
                                            checked={todo.is_completed}
                                            onCheckedChange={() => toggleTodo(todo.id)}
                                        />
                                        <div className="flex-1 min-w-0 grid gap-1">
                                            <span className={cn("text-[15px] font-medium leading-relaxed transition-all", todo.is_completed && "text-muted-foreground line-through")}>
                                                {todo.task}
                                            </span>

                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                                <span className="text-[10px] opacity-70">
                                                    Added {format(new Date(todo.created_at), "MMM d")}
                                                </span>
                                                {(todo.deadline || currentView === 'upcoming') && (
                                                    <div className="flex items-center gap-1">
                                                        <CalendarIcon className="size-3" />
                                                        <span className={cn(todo.deadline === new Date().toISOString().split('T')[0] && "text-green-600 font-medium")}>
                                                            {todo.deadline ? format(new Date(todo.deadline), "d MMM") : "No date"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Subtasks */}
                                            <div className="mt-1 ml-1 pl-4 border-l border-muted/50 space-y-1">
                                                {todos.filter(sub => sub.parent_id === todo.id).map(subtask => (
                                                    <div key={subtask.id} className="flex items-center gap-2 py-1 group/sub">
                                                        <Checkbox
                                                            className="size-3.5 rounded-full"
                                                            checked={subtask.is_completed}
                                                            onCheckedChange={() => toggleTodo(subtask.id)}
                                                        />
                                                        <span className={cn("text-sm flex-1 truncate", subtask.is_completed && "text-muted-foreground line-through")}>
                                                            {subtask.task}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-5 opacity-0 group-hover/sub:opacity-100 text-muted-foreground hover:text-destructive"
                                                            onClick={() => deleteTodo(subtask.id)}
                                                        >
                                                            <X className="size-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="opacity-0 group-hover/row:opacity-100 flex items-center transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => deleteTodo(todo.id)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filterTodos().length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                                    <div className="bg-muted/40 p-4 rounded-full mb-4">
                                        <Inbox className="size-8 text-muted-foreground/50" />
                                    </div>
                                    <p className="font-medium">All caught up</p>
                                    <p className="text-sm">You have no tasks in {currentView}.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </SidebarInset>
            <Toaster />
        </SidebarProvider>
    )
}

function Inbox(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
    )
}
