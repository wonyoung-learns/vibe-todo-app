import { format } from "date-fns"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SortOption } from "@/types/todo"

interface TodoHeaderProps {
    currentView: string;
    sortOrder: SortOption;
    onSortChange: (value: SortOption) => void;
}

export function TodoHeader({ currentView, sortOrder, onSortChange }: TodoHeaderProps) {
    return (
        <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 z-10">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="font-semibold text-lg capitalize">{currentView}</h1>
                <span className="text-muted-foreground text-sm ml-2 font-normal hidden sm:inline">
                    {format(new Date(), 'EEE, MMM d')}
                </span>
            </div>
            <Select value={sortOrder} onValueChange={(value) => onSortChange(value as SortOption)}>
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
    )
}
