import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { PackageIcon, ClipboardListIcon, User2 } from "lucide-react";
import { MonthlyChart } from "./charts/monthly-chart";

interface DashboardProps extends PageProps {
    totalAvailable: number;
    totalUnavailable: number;
    totalActiveLoans: number;
    totalOverdue: number;
    userName: string;
    monthlyLoanData: Array<{
        month: string;
        total: number;
        active: number;
        returned: number;
        cancelled: number;
        overdue: number;
    }>;
}

export default function Dashboard({
    totalAvailable,
    totalUnavailable,
    totalActiveLoans,
    totalOverdue,
    userName,
    monthlyLoanData,
}: DashboardProps) {
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-4 h-full px-4 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-min">
                    {/* Total Equipment */}
                    <div className="min-h-[8rem] rounded-xl border-2 p-4 flex flex-col items-center justify-center text-center">
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

                    {/* Active Rentals */}
                    <div className="min-h-[8rem] rounded-xl border-2 p-4 flex flex-col items-center justify-center text-center">
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

                    {/* Welcome Box */}
                    <div className="min-h-[8rem] rounded-xl border-2 p-4 flex flex-col items-center justify-center text-center">
                        <h3 className="text-md font-semibold">
                            Selamat Datang
                        </h3>
                        <p className="text-3xl font-bold flex items-center gap-2 text-center">
                            <User2 className="h-8 w-8 text-red-600" />
                            <span className="capitalize">{userName}</span>
                        </p>
                        <h4 className="text-sm font-semibold pt-2">
                            Selamat Bekerja!
                        </h4>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="w-full mt-4 rounded-xl overflow-x-auto">
                    <MonthlyChart data={monthlyLoanData} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
