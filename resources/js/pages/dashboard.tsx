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
    Download,
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
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

    // Function to export data as CSV
    const exportToCSV = (data: any[], filename: string) => {
        const headers = Object.keys(data[0]).join(",");
        const rows = data.map((item) => Object.values(item).join(","));
        const csvContent = [headers, ...rows].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to export chart data
    const exportChartData = () => {
        const dataToExport = filteredData.map((item) => ({
            Bulan: item.bulan,
            "Total Peminjaman": item.total,
            "Peminjaman Aktif": item.aktif,
            Dikembalikan: item.dikembalikan,
            Dibatalkan: item.dibatalkan,
            "Terlambat Dikembalikan": item.terlambat,
        }));
        exportToCSV(
            dataToExport,
            `statistik-peminjaman-${selectedYear}-${selectedMonth}`
        );
    };

    // Function to export summary data
    const exportSummaryData = (period: "monthly" | "yearly") => {
        let dataToExport;

        if (period === "monthly") {
            dataToExport = monthlyLoanData.map((item) => ({
                Bulan: item.bulan,
                "Total Peminjaman": item.total,
                "Peminjaman Aktif": item.aktif,
                Dikembalikan: item.dikembalikan,
                Dibatalkan: item.dibatalkan,
                "Terlambat Dikembalikan": item.terlambat,
            }));
        } else {
            // Group by year
            const yearlyData = monthlyLoanData.reduce((acc, item) => {
                const { year } = parseBulanString(item.bulan);
                if (!year) return acc;

                if (!acc[year]) {
                    acc[year] = {
                        Tahun: year,
                        "Total Peminjaman": 0,
                        "Peminjaman Aktif": 0,
                        Dikembalikan: 0,
                        Dibatalkan: 0,
                        "Terlambat Dikembalikan": 0,
                    };
                }

                acc[year]["Total Peminjaman"] += item.total;
                acc[year]["Peminjaman Aktif"] += item.aktif;
                acc[year]["Dikembalikan"] += item.dikembalikan;
                acc[year]["Dibatalkan"] += item.dibatalkan;
                acc[year]["Terlambat Dikembalikan"] += item.terlambat;

                return acc;
            }, {} as Record<string, any>);

            dataToExport = Object.values(yearlyData);
        }

        exportToCSV(
            dataToExport,
            `ringkasan-${period === "monthly" ? "bulanan" : "tahunan"}`
        );
    };

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Welcome Header */}
                <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">
                        Selamat datang,{" "}
                        <span className="font-medium capitalize">
                            {userName}
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
                                {totalAvailable}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <Badge
                                    variant="destructive"
                                    className="mr-1 text-xs"
                                >
                                    {totalUnavailable}
                                </Badge>
                                tidak tersedia
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
                                {totalActiveLoans}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <Badge
                                    variant="destructive"
                                    className="mr-1 text-xs"
                                >
                                    {totalOverdue}
                                </Badge>
                                melebihi deadline
                            </p>
                        </CardContent>
                    </Card>

                    {/* Returned Loans */}
                    <Card className="hover:shadow-md transition-shadow h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                            <CardTitle className="text-xs font-medium">
                                Dikembalikan
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-xl font-bold">
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
                    <Card className="hover:shadow-md transition-shadow h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                            <CardTitle className="text-xs font-medium">
                                Dibatalkan
                            </CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-xl font-bold">
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
                            {/* <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-1"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            Export
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={exportChartData}>
                                        Export Data Chart
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            exportSummaryData("monthly")
                                        }
                                    >
                                        Export Ringkasan Bulanan
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            exportSummaryData("yearly")
                                        }
                                    >
                                        Export Ringkasan Tahunan
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu> */}
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 h-[280px]">
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
        </AuthenticatedLayout>
    );
}
