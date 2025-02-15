"use client";

import * as React from "react";
import {
    BoxIcon,
    CalendarCheck2Icon,
    Home,
    LifeBuoy,
    Send,
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
import { PageProps, User } from "@/types";

const data = {
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
                    url: "/dashboard/items",
                },
                {
                    title: "List Kategori",
                    url: "/dashboard/categories",
                },
            ],
        },
        {
            title: "Manajemen Pinjaman",
            url: "/dashboard/loans",
            icon: CalendarCheck2Icon,
        },
        {
            title: "Manajemen Pegawai",
            url: "/dashboard/users",
            icon: User2Icon,
        },
    ],
    navSecondary: [
        // {
        //     title: "Support",
        //     url: "#",
        //     icon: LifeBuoy,
        // },
        // {
        //     title: "Feedback",
        //     url: "#",
        //     icon: Send,
        // },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<PageProps>().props;
    const userRole = auth.user?.role;

    const filteredNavMain =
        userRole === "SUPER ADMIN"
            ? data.navMain
            : data.navMain.filter((item) => item.title !== "Manajemen Pegawai");

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
                                        <div className="font-bold text-green-500">
                                            {userRole}
                                        </div>
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={filteredNavMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={auth.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
