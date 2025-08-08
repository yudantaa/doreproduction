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
    CardHeader,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
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
            label: "Total",
            color: getChartColors(theme).total,
        },
        aktif: {
            label: "Aktif",
            color: getChartColors(theme).aktif,
        },
        dikembalikan: {
            label: "Kembali",
            color: getChartColors(theme).dikembalikan,
        },
        dibatalkan: {
            label: "Batal",
            color: getChartColors(theme).dibatalkan,
        },
        terlambat: {
            label: "Telat",
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
        <div className="w-full h-full">
            <CardHeader className="p-0 pb-2">
                <div className="flex flex-col gap-1">
                    <CardDescription className="text-xs">
                        {getFilterDescription()}
                    </CardDescription>
                </div>

                {/* Compact Filter Controls */}
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Filter className="h-3 w-3" />
                    </div>

                    <div className="flex gap-2">
                        <Select
                            value={selectedYear}
                            onValueChange={onYearChange}
                        >
                            <SelectTrigger className="w-[100px] h-7 text-xs">
                                <SelectValue placeholder="Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-xs">
                                    Semua Tahun
                                </SelectItem>
                                {availableYears.map((year) => (
                                    <SelectItem
                                        key={year}
                                        value={year}
                                        className="text-xs"
                                    >
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedMonth}
                            onValueChange={onMonthChange}
                        >
                            <SelectTrigger className="w-[110px] h-7 text-xs">
                                <SelectValue placeholder="Bulan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-xs">
                                    Semua Bulan
                                </SelectItem>
                                {availableMonths.map((month) => (
                                    <SelectItem
                                        key={month.value}
                                        value={month.value}
                                        className="text-xs"
                                    >
                                        {month.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 pt-2 h-[calc(100%-60px)]">
                {!chartData || chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-xs">
                            Tidak ada data
                        </p>
                    </div>
                ) : (
                    <ChartContainer config={config} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 5,
                                }}
                                barGap={4}
                                barCategoryGap={8}
                            >
                                <CartesianGrid
                                    strokeDasharray="2 2"
                                    vertical={false}
                                    stroke="hsl(var(--border))"
                                    strokeWidth={0.5}
                                />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={5}
                                    axisLine={false}
                                    tick={{
                                        fontSize: 10,
                                        fill: "hsl(var(--muted-foreground))",
                                    }}
                                    tickFormatter={(value) =>
                                        value.split(" ")[0]
                                    }
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={5}
                                    tick={{
                                        fontSize: 10,
                                        fill: "hsl(var(--muted-foreground))",
                                    }}
                                    width={30}
                                />
                                <Tooltip
                                    content={<ChartTooltipContent />}
                                    cursor={{
                                        fill: "hsl(var(--secondary))",
                                        fillOpacity: 0.1,
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{
                                        fontSize: 10,
                                        paddingTop: 5,
                                    }}
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => (
                                        <span className="text-muted-foreground">
                                            {value}
                                        </span>
                                    )}
                                />
                                <Bar
                                    dataKey="total"
                                    fill={colors.total}
                                    radius={[2, 2, 0, 0]}
                                    barSize={12}
                                />
                                <Bar
                                    dataKey="aktif"
                                    fill={colors.aktif}
                                    radius={[2, 2, 0, 0]}
                                    barSize={12}
                                />
                                <Bar
                                    dataKey="dikembalikan"
                                    fill={colors.dikembalikan}
                                    radius={[2, 2, 0, 0]}
                                    barSize={12}
                                />
                                <Bar
                                    dataKey="dibatalkan"
                                    fill={colors.dibatalkan}
                                    radius={[2, 2, 0, 0]}
                                    barSize={12}
                                />
                                <Bar
                                    dataKey="terlambat"
                                    fill={colors.terlambat}
                                    radius={[2, 2, 0, 0]}
                                    barSize={12}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </CardContent>
        </div>
    );
};

export default MonthlyChart;
