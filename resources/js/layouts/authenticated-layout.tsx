import { PropsWithChildren, ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import AppearanceDropdown from "@/components/appearance-dropdown";

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{
    header?: ReactNode;
}>) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-hidden">
                <AppSidebar />

                <SidebarInset className="flex-1 flex flex-col overflow-hidden w-full">
                    <header className="sticky top-0 z-10 bg-background flex h-16 shrink-0 items-center gap-2 justify-between p-4 border-b md:border-none md:rounded-xl">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            {header}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div>
                            <AppearanceDropdown />
                        </div>
                    </header>

                    <main className="p-4 md:pt-0 overflow-auto flex-1 w-full max-w-full">
                        <div className="w-full max-w-full mx-auto">
                            {children}
                        </div>
                    </main>
                    <Toaster />
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
