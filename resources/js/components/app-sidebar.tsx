"use client";

import * as React from "react";
import {
    BookAIcon,
    BoxIcon,
    CalendarCheck2Icon,
    Command,
    Frame,
    Home,
    LifeBuoy,
    Send,
    SquareTerminal,
    User2Icon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
        },
        {
            title: "Manajemen Barang",
            url: "#",
            icon: BoxIcon,
            isActive: true,
            items: [
                {
                    title: "List Barang",
                    url: "#",
                },
                {
                    title: "List Kategori",
                    url: "#",
                },
            ],
        },
        {
            title: "Manajemen Pinjaman",
            url: "#",
            icon: CalendarCheck2Icon,
            isActive: true,
            items: [
                {
                    title: "List Pinjaman",
                    url: "#",
                },
            ],
        },
        {
            title: "Manajemen Pegawai",
            url: "#",
            icon: User2Icon,
            isActive: true,
            items: [
                {
                    title: "List Pegawai",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<PageProps>().props;

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route("dashboard")}>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <img
                                        src="/logo.jpg"
                                        alt="Dore Production Logo"
                                        className="h-full w-full object-contain rounded-lg"
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        Dore Production
                                    </span>
                                    <span className="truncate text-xs">
                                        Dashboard
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={auth.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
