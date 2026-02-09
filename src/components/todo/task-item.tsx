import { format } from "date-fns"
import { Calendar as CalendarIcon, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Todo } from "@/types/todo"

interface TaskItemProps {
    todo: Todo;
    subtasks: Todo[];
    currentView: string;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onSelect: (todo: Todo) => void;
}

export function TaskItem({ todo, subtasks, currentView, onToggle, onDelete, onSelect }: TaskItemProps) {
    const isToday = new Date().toISOString().split('T')[0];

    return (
        <div className="group relative">
            <div className="flex items-start gap-3 py-3 px-1 rounded-lg hover:bg-muted/40 transition-colors group/row">
                <Checkbox
                    className="mt-1 rounded-full size-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary border-muted-foreground/30"
                    checked={todo.is_completed}
                    onCheckedChange={() => onToggle(todo.id)}
                />
                <div className="flex-1 min-w-0 grid gap-1">
                    <span
                        className={cn("text-[15px] font-medium leading-relaxed transition-all cursor-pointer hover:text-primary", todo.is_completed && "text-muted-foreground line-through")}
                        onClick={() => onSelect(todo)}
                    >
                        {todo.task}
                    </span>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="text-[10px] opacity-70">
                            Added {format(new Date(todo.created_at), "MMM d")}
                        </span>
                        {(todo.deadline || currentView === 'upcoming') && (
                            <div className="flex items-center gap-1">
                                <CalendarIcon className="size-3" />
                                <span className={cn(todo.deadline === isToday && "text-green-600 font-medium")}>
                                    {todo.deadline ? format(new Date(todo.deadline), "d MMM") : "No date"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Subtasks */}
                    {subtasks.length > 0 && (
                        <div className="mt-1 ml-1 pl-4 border-l border-muted/50 space-y-1">
                            {subtasks.map(subtask => (
                                <div key={subtask.id} className="flex items-center gap-2 py-1 group/sub">
                                    <Checkbox
                                        className="size-3.5 rounded-full"
                                        checked={subtask.is_completed}
                                        onCheckedChange={() => onToggle(subtask.id)}
                                    />
                                    <span
                                        className={cn("text-sm flex-1 truncate cursor-pointer hover:text-primary", subtask.is_completed && "text-muted-foreground line-through")}
                                        onClick={() => onSelect(subtask)}
                                    >
                                        {subtask.task}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-5 opacity-0 group-hover/sub:opacity-100 text-muted-foreground hover:text-destructive"
                                        onClick={() => onDelete(subtask.id)}
                                    >
                                        <X className="size-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="opacity-0 group-hover/row:opacity-100 flex items-center transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(todo.id)}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
