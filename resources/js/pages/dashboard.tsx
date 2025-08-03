import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { PackageIcon, ClipboardListIcon, User2 } from "lucide-react";
import { MonthlyChart } from "./charts/monthly-chart";
import { useState, useMemo } from "react";

interface DashboardProps extends PageProps {
    totalAvailable: number;
    totalUnavailable: number;
    totalActiveLoans: number;
    totalOverdue: number;
    userName: string;
    monthlyLoanData: Array<{
        bulan: string;
        total: number;
        aktif: number;
        dikembalikan: number;
        dibatalkan: number;
        terlambat: number;
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
    const [selectedYear, setSelectedYear] = useState<string>("all");
    const [selectedMonth, setSelectedMonth] = useState<string>("all");

    // Extract unique years from the bulan field (assuming format like "2024-01" or "Januari 2024")
    const availableYears = useMemo(() => {
        const years = new Set<string>();
        monthlyLoanData.forEach((item) => {
            // Try to extract year from bulan string
            const yearMatch = item.bulan.match(/\d{4}/);
            if (yearMatch) {
                years.add(yearMatch[0]);
            }
        });
        return Array.from(years).sort();
    }, [monthlyLoanData]);

    // Extract unique months from the bulan field
    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        monthlyLoanData.forEach((item) => {
            // Extract month part (assuming formats like "2024-01", "Januari 2024", etc.)
            let monthPart = item.bulan;
            if (item.bulan.includes("-")) {
                monthPart =
                    item.bulan.split("-")[1] || item.bulan.split("-")[0];
            } else {
                // For formats like "Januari 2024", extract the month name
                monthPart = item.bulan.replace(/\d{4}/, "").trim();
            }
            months.add(monthPart);
        });
        return Array.from(months).sort();
    }, [monthlyLoanData]);

    // Filter data based on selected year and month
    const filteredData = useMemo(() => {
        return monthlyLoanData.filter((item) => {
            const yearMatch =
                selectedYear === "all" || item.bulan.includes(selectedYear);
            const monthMatch =
                selectedMonth === "all" || item.bulan.includes(selectedMonth);
            return yearMatch && monthMatch;
        });
    }, [monthlyLoanData, selectedYear, selectedMonth]);

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 h-full w-full pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
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

                {/* Chart Section with Filters */}
                <div className="">
                    <MonthlyChart
                        data={filteredData}
                        selectedYear={selectedYear}
                        selectedMonth={selectedMonth}
                        availableYears={availableYears}
                        availableMonths={availableMonths}
                        onYearChange={setSelectedYear}
                        onMonthChange={setSelectedMonth}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
