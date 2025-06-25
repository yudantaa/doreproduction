import ApplicationLogo from "@/components/application-logo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import AppearanceDropdown from "@/components/appearance-dropdown";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col items-center bg-background px-4 py-8">
            <div className="mb-4">
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 text-gray-500" />
                </Link>
            </div>
            <AppearanceDropdown />
            <div className="w-full">{children}</div>
        </div>
    );
}
