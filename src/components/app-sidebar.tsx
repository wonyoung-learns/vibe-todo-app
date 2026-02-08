import { Calendar, Inbox, CalendarDays, Check, LogOut } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
        title: "Inbox",
        url: "#inbox",
        icon: Inbox,
        id: "inbox",
    },
    {
        title: "Today",
        url: "#today",
        icon: Calendar,
        id: "today",
    },
    {
        title: "Upcoming",
        url: "#upcoming",
        icon: CalendarDays,
        id: "upcoming",
    },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    currentView: string;
    setCurrentView: (view: any) => void;
    setIsLoggedIn: (value: boolean) => void;
    todoCounts: { [key: string]: number };
}

export function AppSidebar({ currentView, setCurrentView, setIsLoggedIn, todoCounts, ...props }: AppSidebarProps) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-600 text-sidebar-primary-foreground">
                                    <Check className="size-4 text-white" strokeWidth={3} />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Todoist</span>
                                    <span className="">v2.0</span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Tasks</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={currentView === item.id}
                                        onClick={() => setCurrentView(item.id)}
                                    >
                                        <a href={item.url} className="flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </span>
                                            {todoCounts[item.id] > 0 && (
                                                <span className="text-xs text-muted-foreground mr-2">{todoCounts[item.id]}</span>
                                            )}
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => setIsLoggedIn(false)}
                            className="text-muted-foreground hover:text-red-600"
                        >
                            <LogOut />
                            <span>Log out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
