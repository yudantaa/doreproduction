import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { PackageIcon, ClipboardListIcon, User2 } from "lucide-react";
import { MonthlyChart } from "./charts/monthly-chart";
interface DashboardProps extends PageProps {
    totalAvailable: number;
}

export default function Dashboard({
    totalAvailable,
    totalUnavailable,
    totalActiveLoans,
    totalOverdue,
    userName,
}: DashboardProps) {
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-4 h-full">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Total Equipment */}
                    <div className="rounded-xl border-2 p-4 flex flex-col items-center justify-center text-center h-32">
                        <h3 className="text-md font-semibold">
                            Total Equipment Tersedia
                        </h3>
                        <p className="text-3xl font-bold flex items-center gap-2">
                            <PackageIcon className="h-8 w-8 text-red-600" />
                            {totalAvailable}
                        </p>
                        <h4 className="text-sm font-semibold pt-2">
                            <span className="text-red-700">
                                {totalUnavailable}
                            </span>{" "}
                            Tidak Tersedia
                        </h4>
                    </div>

                    <div className="rounded-xl border-2 p-4 flex flex-col items-center justify-center text-center h-32">
                        <h3 className="text-md font-semibold">
                            Penyewaan Aktif
                        </h3>
                        <p className="text-3xl font-bold flex items-center gap-2">
                            <ClipboardListIcon className="h-8 w-8 text-red-600" />
                            {totalActiveLoans}
                        </p>

                        <h4 className="text-sm font-semibold pt-2">
                            <span className="text-red-700">{totalOverdue}</span>{" "}
                            Telat Deadline
                        </h4>
                    </div>
                    <div className="rounded-xl border-2 p-4 flex flex-col items-center justify-center text-center h-32">
                        <h3 className="text-md font-semibold">
                            Selamat Datang
                        </h3>
                        <p className="text-3xl font-bold flex items-center gap-2">
                            <User2 className="h-8 w-8 text-red-600" />
                            <span className="text-transform: capitalize">
                                {userName}
                            </span>
                        </p>

                        <h4 className="text-sm font-semibold pt-2">
                            Selamat Bekerja!
                        </h4>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="flex-1 rounded-xl bg-muted/50 mt-4">
                    <MonthlyChart></MonthlyChart>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
