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
import { Filter } from "lucide-react";
import { useTheme } from "next-themes";

const getChartColors = (theme: string) => ({
    total: theme === "dark" ? "#7c3aed" : "#8b5cf6", // Purple
    aktif: theme === "dark" ? "#2563eb" : "#3b82f6", // Blue
    dikembalikan: theme === "dark" ? "#059669" : "#10b981", // Green
    dibatalkan: theme === "dark" ? "#d97706" : "#f59e0b", // Amber
    terlambat: theme === "dark" ? "#dc2626" : "#ef4444", // Red
});

const chartConfig = (theme: string) =>
    ({
        total: {
            label: "Total Pinjaman",
            color: getChartColors(theme).total,
        },
        aktif: {
            label: "Aktif",
            color: getChartColors(theme).aktif,
        },
        dikembalikan: {
            label: "Dikembalikan",
            color: getChartColors(theme).dikembalikan,
        },
        dibatalkan: {
            label: "Dibatalkan",
            color: getChartColors(theme).dibatalkan,
        },
        terlambat: {
            label: "Terlambat",
            color: getChartColors(theme).terlambat,
        },
    } satisfies ChartConfig);

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
    availableMonths: Array<{ value: string; name: string }>;
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
    const { theme } = useTheme();
    const colors = getChartColors(theme || "light");
    const config = chartConfig(theme || "light");

    // Format data for display in chart
    const chartData = data.map((item) => ({
        ...item,
        month: item.bulan,
    }));

    const getFilterDescription = () => {
        const yearText =
            selectedYear === "all" ? "Semua Tahun" : `Tahun ${selectedYear}`;

        const selectedMonthData = availableMonths.find(
            (m) => m.value === selectedMonth
        );
        const monthText =
            selectedMonth === "all"
                ? "Semua Bulan"
                : `Bulan ${selectedMonthData?.name || selectedMonth}`;

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
        <Card className="border shadow-sm bg-card">
            <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col gap-1">
                        <CardDescription className="text-xs sm:text-sm">
                            {getFilterDescription()}
                        </CardDescription>
                    </div>

                    {/* Filter Controls */}
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
                                        <SelectItem
                                            key={month.value}
                                            value={month.value}
                                        >
                                            {month.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="w-full overflow-hidden px-3 sm:px-6">
                {!chartData || chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-48 sm:h-64">
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Tidak ada data untuk filter yang dipilih.
                        </p>
                    </div>
                ) : (
                    <ChartContainer
                        config={config}
                        className="h-48 sm:h-64 md:h-80 w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 20,
                                    bottom: 20,
                                }}
                                barGap={8}
                                barCategoryGap={12}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="hsl(var(--border))"
                                    strokeWidth={0.5}
                                />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tick={{
                                        fontSize: 12,
                                        fill: "hsl(var(--muted-foreground))",
                                    }}
                                    tickFormatter={(value) => {
                                        if (window.innerWidth < 640) {
                                            return value.split(" ")[0];
                                        }
                                        return value;
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}
                                    tick={{
                                        fontSize: 12,
                                        fill: "hsl(var(--muted-foreground))",
                                    }}
                                    width={40}
                                />
                                <Tooltip
                                    content={<ChartTooltipContent />}
                                    cursor={{
                                        fill: "hsl(var(--secondary))",
                                        fillOpacity: 0.2,
                                        stroke: "hsl(var(--border))",
                                        strokeWidth: 1,
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{
                                        fontSize: 12,
                                        paddingTop: 20,
                                    }}
                                    iconType="circle"
                                    iconSize={10}
                                    formatter={(value) => (
                                        <span className="text-muted-foreground">
                                            {value}
                                        </span>
                                    )}
                                />
                                <Bar
                                    dataKey="total"
                                    fill={colors.total}
                                    radius={[4, 4, 0, 0]}
                                    barSize={20}
                                />
                                <Bar
                                    dataKey="aktif"
                                    fill={colors.aktif}
                                    radius={[4, 4, 0, 0]}
                                    barSize={20}
                                />
                                <Bar
                                    dataKey="dikembalikan"
                                    fill={colors.dikembalikan}
                                    radius={[4, 4, 0, 0]}
                                    barSize={20}
                                />
                                <Bar
                                    dataKey="dibatalkan"
                                    fill={colors.dibatalkan}
                                    radius={[4, 4, 0, 0]}
                                    barSize={20}
                                />
                                <Bar
                                    dataKey="terlambat"
                                    fill={colors.terlambat}
                                    radius={[4, 4, 0, 0]}
                                    barSize={20}
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
