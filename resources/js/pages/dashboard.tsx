import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    Package,
    ClipboardList,
    User,
    AlertTriangle,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { MonthlyChart } from "./charts/monthly-chart";
import { useState, useMemo } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Removed DropdownMenu imports as export functionality is removed

interface DashboardProps extends PageProps {
    totalAvailable: number;
    totalUnavailable: number;
    totalActiveLoans: number;
    totalOverdue: number;
    totalBrokenItems: number;
    pendingRepairs: number;
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
    totalBrokenItems,
    pendingRepairs,
    userName,
    monthlyLoanData,
}: DashboardProps) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");

    const [selectedYear, setSelectedYear] = useState<string>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<string>("all");

    const parseBulanString = (bulan: string) => {
        const parts = bulan.split(" ");
        if (parts.length === 2) {
            const monthName = parts[0];
            const year = parts[1];

            const monthNames = [
                "Januari",
                "Februari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember",
            ];

            const monthIndex =
                monthNames.findIndex((name) => name === monthName) + 1;
            const month = monthIndex.toString().padStart(2, "0");

            return { year, month, monthName };
        }
        return { year: null, month: null, monthName: null };
    };

    const availableYears = useMemo(() => {
        const years = new Set<string>();
        if (monthlyLoanData && monthlyLoanData.length > 0) {
            monthlyLoanData.forEach((item) => {
                const { year } = parseBulanString(item.bulan);
                if (year) years.add(year);
            });
        }
        return Array.from(years).sort();
    }, [monthlyLoanData]);

    const availableMonths = useMemo(() => {
        const monthsMap = new Map<string, { value: string; name: string }>();
        if (monthlyLoanData && monthlyLoanData.length > 0) {
            monthlyLoanData.forEach((item) => {
                const { month, monthName } = parseBulanString(item.bulan);
                if (month && monthName) {
                    monthsMap.set(month, { value: month, name: monthName });
                }
            });
        }
        return Array.from(monthsMap.values()).sort(
            (a, b) => parseInt(a.value) - parseInt(b.value)
        );
    }, [monthlyLoanData]);

    const filteredData = useMemo(() => {
        if (!monthlyLoanData || monthlyLoanData.length === 0) {
            return [];
        }

        return monthlyLoanData.filter((item) => {
            const { year, month } = parseBulanString(item.bulan);
            const yearMatch = selectedYear === "all" || year === selectedYear;
            const monthMatch =
                selectedMonth === "all" || month === selectedMonth;
            return yearMatch && monthMatch;
        });
    }, [monthlyLoanData, selectedYear, selectedMonth]);

    // Removed export functions

    // Calculate totals safely
    const totalDikembalikan =
        monthlyLoanData?.reduce(
            (acc, curr) => acc + (curr.dikembalikan || 0),
            0
        ) || 0;

    const totalDibatalkan =
        monthlyLoanData?.reduce(
            (acc, curr) => acc + (curr.dibatalkan || 0),
            0
        ) || 0;

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Welcome Header */}
                <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">
                        Selamat datang,{" "}
                        <span className="font-medium capitalize">
                            {userName || "User"}
                        </span>
                    </p>
                </div>

                {/* Compact Stats Grid */}
                <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                    {/* Available Equipment */}
                    <Card className="hover:shadow-md transition-shadow h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                            <CardTitle className="text-xs font-medium">
                                Equipment Tersedia
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-xl font-bold">
                                {totalAvailable || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <Badge
                                    variant="destructive"
                                    className="mr-1 text-xs"
                                >
                                    {totalUnavailable || 0}
                                </Badge>
                                tidak tersedia
                            </p>
                        </CardContent>
                    </Card>

                    {/* Broken Items Card */}
                    <Card className="hover:shadow-md transition-shadow h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                            <CardTitle className="text-xs font-medium">
                                Barang Rusak
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-xl font-bold">
                                {totalBrokenItems || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <Badge
                                    variant="destructive"
                                    className="mr-1 text-xs"
                                >
                                    {pendingRepairs || 0}
                                </Badge>
                                menunggu perbaikan
                            </p>
                        </CardContent>
                    </Card>

                    {/* Active Loans */}
                    <Card className="hover:shadow-md transition-shadow h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                            <CardTitle className="text-xs font-medium">
                                Penyewaan Aktif
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-xl font-bold">
                                {totalActiveLoans || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <Badge
                                    variant="destructive"
                                    className="mr-1 text-xs"
                                >
                                    {totalOverdue || 0}
                                </Badge>
                                melebihi deadline
                            </p>
                        </CardContent>
                    </Card>

                    {/* Returned Loans */}
                    <Card className="hover:shadow-md transition-shadow h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                            <CardTitle className="text-xs font-medium">
                                Selesai
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-xl font-bold">
                                {totalDikembalikan}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total selesai
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Row for Cancelled Loans */}
                <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                    {/* Cancelled Loans */}
                    <Card className="hover:shadow-md transition-shadow h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                            <CardTitle className="text-xs font-medium">
                                Dibatalkan
                            </CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-xl font-bold">
                                {totalDibatalkan}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total pembatalan
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Compact Chart Section */}
                <Card className="hover:shadow-md transition-shadow mt-2">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-sm">
                                    Statistik Peminjaman
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Ringkasan aktivitas peminjaman per bulan
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 h-[280px]">
                        {!monthlyLoanData || monthlyLoanData.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-muted-foreground text-sm">
                                    Tidak ada data statistik tersedia
                                </p>
                            </div>
                        ) : (
                            <MonthlyChart
                                data={filteredData}
                                selectedYear={selectedYear}
                                selectedMonth={selectedMonth}
                                availableYears={availableYears}
                                availableMonths={availableMonths}
                                onYearChange={setSelectedYear}
                                onMonthChange={setSelectedMonth}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
