import { useState } from "react"
import { Calendar as CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface AddTaskFormProps {
    onAdd: (task: string, deadline?: Date) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [newTask, setNewTask] = useState('')
    const [deadline, setDeadline] = useState<Date | undefined>()

    const handleSubmit = () => {
        if (!newTask.trim()) return
        onAdd(newTask, deadline)
        setNewTask('')
        setDeadline(undefined)
        setIsAddingTask(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmit()
        if (e.key === 'Escape') setIsAddingTask(false)
    }

    if (!isAddingTask) {
        return (
            <div className="mb-2">
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
            </div>
        )
    }

    return (
        <div className="mb-2">
            <Card className="p-4 border-muted-foreground/20 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col gap-3">
                    <Input
                        autoFocus
                        placeholder="Task name"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={handleKeyDown}
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
                            <Button size="sm" onClick={handleSubmit} disabled={!newTask.trim()}>Add Task</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
