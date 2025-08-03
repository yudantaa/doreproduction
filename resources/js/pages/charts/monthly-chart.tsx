import React from "react";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, Filter } from "lucide-react";

const chartConfig = {
    total: {
        label: "Total Pinjaman",
        color: "hsl(var(--chart-1))",
    },
    aktif: {
        label: "Aktif",
        color: "#3b82f6", // blue-500
    },
    dikembalikan: {
        label: "Dikembalikan",
        color: "#22c55e", // green-500
    },
    dibatalkan: {
        label: "Dibatalkan",
        color: "#f97316", // orange-500
    },
    terlambat: {
        label: "Terlambat",
        color: "#ef4444", // red-500
    },
} satisfies ChartConfig;

interface MonthlyChartProps {
    data: Array<{
        bulan: string;
        total: number;
        aktif: number;
        dikembalikan: number;
        dibatalkan: number;
        terlambat: number;
    }>;
    selectedYear: string;
    selectedMonth: string;
    availableYears: string[];
    availableMonths: string[];
    onYearChange: (year: string) => void;
    onMonthChange: (month: string) => void;
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({
    data,
    selectedYear,
    selectedMonth,
    availableYears,
    availableMonths,
    onYearChange,
    onMonthChange,
}) => {
    const currentYear = new Date().getFullYear();

    // Format data for display in chart
    const chartData = data.map((item) => ({
        ...item,
        month: item.bulan,
    }));

    const getFilterDescription = () => {
        const yearText =
            selectedYear === "all" ? "Semua Tahun" : `Tahun ${selectedYear}`;
        const monthText =
            selectedMonth === "all" ? "Semua Bulan" : `Bulan ${selectedMonth}`;

        if (selectedYear === "all" && selectedMonth === "all") {
            return "Menampilkan semua data";
        } else if (selectedYear !== "all" && selectedMonth === "all") {
            return yearText;
        } else if (selectedYear === "all" && selectedMonth !== "all") {
            return monthText;
        } else {
            return `${monthText}, ${yearText}`;
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                            Data Pinjaman Bulanan
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm mt-1">
                            {getFilterDescription()}
                        </CardDescription>
                    </div>

                    {/* Filter Controls - Mobile Optimized */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Filter:</span>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                            <Select
                                value={selectedYear}
                                onValueChange={onYearChange}
                            >
                                <SelectTrigger className="w-full sm:w-[120px] h-8 sm:h-9 text-xs sm:text-sm">
                                    <SelectValue placeholder="Pilih Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Tahun
                                    </SelectItem>
                                    {availableYears.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedMonth}
                                onValueChange={onMonthChange}
                            >
                                <SelectTrigger className="w-full sm:w-[130px] h-8 sm:h-9 text-xs sm:text-sm">
                                    <SelectValue placeholder="Pilih Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Bulan
                                    </SelectItem>
                                    {availableMonths.map((month) => (
                                        <SelectItem key={month} value={month}>
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="w-full overflow-hidden px-3 sm:px-6">
                {/* Show message if no data after filtering */}
                {!chartData || chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-48 sm:h-64">
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Tidak ada data untuk filter yang dipilih.
                        </p>
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="h-48 sm:h-64 md:h-80 w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 5,
                                    left: 5,
                                    bottom: 15,
                                }}
                                barCategoryGap="15%"
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={8}
                                    axisLine={false}
                                    tickFormatter={(value) => {
                                        // Mobile-friendly month display
                                        if (window.innerWidth < 640) {
                                            if (value.length > 6) {
                                                return (
                                                    value.slice(0, 4) + "..."
                                                );
                                            }
                                        } else if (value.length > 10) {
                                            return value.slice(0, 8) + "...";
                                        }
                                        return value;
                                    }}
                                    fontSize={10}
                                    className="sm:text-xs"
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={8}
                                    fontSize={10}
                                    className="sm:text-xs"
                                    width={35}
                                />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: "10px" }}
                                    iconSize={8}
                                    className="sm:text-xs"
                                />
                                <Bar
                                    dataKey="total"
                                    fill="var(--color-total)"
                                    radius={[1, 1, 0, 0]}
                                    maxBarSize={15}
                                    className="sm:max-w-5"
                                />
                                <Bar
                                    dataKey="aktif"
                                    fill="var(--color-aktif)"
                                    radius={[1, 1, 0, 0]}
                                    maxBarSize={15}
                                    className="sm:max-w-5"
                                />
                                <Bar
                                    dataKey="dikembalikan"
                                    fill="var(--color-dikembalikan)"
                                    radius={[1, 1, 0, 0]}
                                    maxBarSize={15}
                                    className="sm:max-w-5"
                                />
                                <Bar
                                    dataKey="dibatalkan"
                                    fill="var(--color-dibatalkan)"
                                    radius={[1, 1, 0, 0]}
                                    maxBarSize={15}
                                    className="sm:max-w-5"
                                />
                                <Bar
                                    dataKey="terlambat"
                                    fill="var(--color-terlambat)"
                                    radius={[1, 1, 0, 0]}
                                    maxBarSize={15}
                                    className="sm:max-w-5"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-xs sm:text-sm pt-3 sm:pt-6">
                <div className="leading-none text-muted-foreground">
                    {chartData.length > 0
                        ? `Menampilkan ${chartData.length} periode data pinjaman`
                        : "Tidak ada data untuk ditampilkan"}
                </div>
            </CardFooter>
        </Card>
    );
};

export default MonthlyChart;
