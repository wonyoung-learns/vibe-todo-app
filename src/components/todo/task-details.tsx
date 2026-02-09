import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Todo } from "@/types/todo"

interface TaskDetailsSheetProps {
    todo: Todo | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<Todo>) => void;
    onDelete: (id: string) => void;
}

export function TaskDetailsSheet({ todo, isOpen, onClose, onUpdate, onDelete }: TaskDetailsSheetProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState<Todo['priority']>(undefined)
    const [deadline, setDeadline] = useState<Date | undefined>(undefined)

    // Sync state when todo changes
    useEffect(() => {
        if (todo) {
            setTitle(todo.task)
            setDescription(todo.description || "")
            setPriority(todo.priority)
            setDeadline(todo.deadline ? new Date(todo.deadline) : undefined)
        }
    }, [todo])

    const handleSave = () => {
        if (!todo) return

        onUpdate(todo.id, {
            task: title,
            description,
            priority,
            deadline: deadline ? deadline.toISOString().split('T')[0] : undefined
        })
    }

    // Auto-save on blur or specific changes could be better, but for now let's save on close or specific actions
    // For a smoother experience, we can auto-save when values change with a debounce, 
    // but simple "Save" or specific field updates is easier to reason about first.
    // Let's trigger updates immediately on change for a "live" feel.

    const updateField = (updates: Partial<Todo>) => {
        if (!todo) return
        onUpdate(todo.id, updates)
    }

    if (!todo) return null

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col gap-6 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Task Details</SheetTitle>
                    <SheetDescription>
                        View and edit the details of your task.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-4 flex-1">
                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Task</label>
                        <Input
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                updateField({ task: e.target.value })
                            }}
                            className="font-medium text-lg"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                                updateField({ description: e.target.value })
                            }}
                            placeholder="Add notes..."
                            className="min-h-[100px] resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Priority */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted-foreground">Priority</label>
                            <Select
                                value={priority || "none"}
                                onValueChange={(val) => {
                                    const newPriority = val === "none" ? undefined : val as Todo['priority']
                                    setPriority(newPriority)
                                    updateField({ priority: newPriority })
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Deadline */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !deadline && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={deadline}
                                        onSelect={(date) => {
                                            setDeadline(date)
                                            updateField({ deadline: date ? date.toISOString().split('T')[0] : undefined })
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                <SheetFooter className="mt-auto sm:justify-between border-t pt-4">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            onDelete(todo.id)
                            onClose()
                        }}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Task
                    </Button>
                    <Button onClick={onClose}>Done</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
