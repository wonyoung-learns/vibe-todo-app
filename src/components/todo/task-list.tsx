import { Inbox } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Todo } from "@/types/todo"
import { TaskItem } from "./task-item"

interface TaskListProps {
    todos: Todo[]; // All todos, needed for subtask lookup
    visibleTodos: Todo[]; // Filtered root todos
    currentView: string;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onSelect: (todo: Todo) => void;
}

export function TaskList({ todos, visibleTodos, currentView, onToggle, onDelete, onSelect }: TaskListProps) {
    if (visibleTodos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <div className="bg-muted/40 p-4 rounded-full mb-4">
                    <Inbox className="size-8 text-muted-foreground/50" />
                </div>
                <p className="font-medium">All caught up</p>
                <p className="text-sm">You have no tasks in {currentView}.</p>
            </div>
        )
    }

    return (
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
            <div className="flex flex-col gap-1 pb-12">
                {visibleTodos.map(todo => (
                    <TaskItem
                        key={todo.id}
                        todo={todo}
                        subtasks={todos.filter(t => t.parent_id === todo.id)}
                        currentView={currentView}
                        onToggle={onToggle}
                        onDelete={onDelete}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </ScrollArea>
    )
}
