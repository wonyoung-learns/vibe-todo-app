export interface Todo {
    id: string;
    task: string;
    is_completed: boolean;
    created_at: string;
    parent_id?: string;
    deadline?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
}

export type SortOption = 'created_desc' | 'created_asc' | 'deadline_asc' | 'alphabetical';

export type View = 'inbox' | 'today' | 'upcoming';
