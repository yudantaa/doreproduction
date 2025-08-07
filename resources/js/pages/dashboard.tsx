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
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");

    const [selectedYear, setSelectedYear] = useState<string>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);

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
        monthlyLoanData.forEach((item) => {
            const { year } = parseBulanString(item.bulan);
            if (year) years.add(year);
        });
        return Array.from(years).sort();
    }, [monthlyLoanData]);

    const availableMonths = useMemo(() => {
        const monthsMap = new Map<string, { value: string; name: string }>();
        monthlyLoanData.forEach((item) => {
            const { month, monthName } = parseBulanString(item.bulan);
            if (month && monthName) {
                monthsMap.set(month, { value: month, name: monthName });
            }
        });
        return Array.from(monthsMap.values()).sort(
            (a, b) => parseInt(a.value) - parseInt(b.value)
        );
    }, [monthlyLoanData]);

    const filteredData = useMemo(() => {
        return monthlyLoanData.filter((item) => {
            const { year, month } = parseBulanString(item.bulan);
            const yearMatch = selectedYear === "all" || year === selectedYear;
            const monthMatch =
                selectedMonth === "all" || month === selectedMonth;
            return yearMatch && monthMatch;
        });
    }, [monthlyLoanData, selectedYear, selectedMonth]);

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Welcome Header */}
                <div className="space-y-1">
                    <p className="text-muted-foreground">
                        Selamat datang,{" "}
                        <span className="font-medium capitalize">
                            {userName}
                        </span>
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Available Equipment */}
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Equipment Tersedia
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalAvailable}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <Badge variant="destructive" className="mr-1">
                                    {totalUnavailable}
                                </Badge>
                                tidak tersedia
                            </p>
                        </CardContent>
                    </Card>

                    {/* Active Loans */}
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Penyewaan Aktif
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalActiveLoans}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <Badge variant="destructive" className="mr-1">
                                    {totalOverdue}
                                </Badge>
                                melebihi deadline
                            </p>
                        </CardContent>
                    </Card>

                    {/* Returned Loans */}
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Dikembalikan
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {monthlyLoanData.reduce(
                                    (acc, curr) => acc + curr.dikembalikan,
                                    0
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total pengembalian bulan ini
                            </p>
                        </CardContent>
                    </Card>

                    {/* Cancelled Loans */}
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Dibatalkan
                            </CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {monthlyLoanData.reduce(
                                    (acc, curr) => acc + curr.dibatalkan,
                                    0
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total pembatalan bulan ini
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart Section */}
                <div className="grid gap-4 md:grid-cols-1">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle>Statistik Peminjaman</CardTitle>
                            <CardDescription>
                                Ringkasan aktivitas peminjaman per bulan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MonthlyChart
                                data={filteredData}
                                selectedYear={selectedYear}
                                selectedMonth={selectedMonth}
                                availableYears={availableYears}
                                availableMonths={availableMonths}
                                onYearChange={setSelectedYear}
                                onMonthChange={setSelectedMonth}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
