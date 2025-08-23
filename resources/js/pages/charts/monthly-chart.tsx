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
import { CardContent, CardDescription, CardHeader } from "@/components/ui/card";
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

const getChartColors = () => ({
    total: "#8b5cf6", // Purple
    aktif: "#3b82f6", // Blue
    dikembalikan: "#10b981", // Green
    dibatalkan: "#f59e0b", // Amber
    terlambat: "#ef4444", // Red
});

const chartConfig = () =>
    ({
        total: {
            label: "Total",
            color: getChartColors().total,
        },
        aktif: {
            label: "Aktif",
            color: getChartColors().aktif,
        },
        dikembalikan: {
            label: "Kembali",
            color: getChartColors().dikembalikan,
        },
        dibatalkan: {
            label: "Batal",
            color: getChartColors().dibatalkan,
        },
        terlambat: {
            label: "Telat",
            color: getChartColors().terlambat,
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
    const colors = getChartColors();
    const config = chartConfig();

    const chartData = data.map((item) => ({
        ...item,
        month: item.bulan,
        // Ensure all values are numbers
        total: Number(item.total) || 0,
        aktif: Number(item.aktif) || 0,
        dikembalikan: Number(item.dikembalikan) || 0,
        dibatalkan: Number(item.dibatalkan) || 0,
        terlambat: Number(item.terlambat) || 0,
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

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                    <p className="font-semibold text-sm mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p
                            key={index}
                            className="text-xs"
                            style={{ color: entry.color }}
                        >
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
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
                            Tidak ada data untuk ditampilkan
                        </p>
                    </div>
                ) : (
                    <div className="h-full w-full">
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
                                    stroke="#e5e7eb"
                                    strokeWidth={0.5}
                                />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={5}
                                    axisLine={false}
                                    tick={{
                                        fontSize: 10,
                                        fill: "#6b7280",
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
                                        fill: "#6b7280",
                                    }}
                                    width={30}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    wrapperStyle={{
                                        fontSize: 10,
                                        paddingTop: 5,
                                    }}
                                    iconType="circle"
                                    iconSize={8}
                                />
                                <Bar
                                    name="Total"
                                    dataKey="total"
                                    fill={colors.total}
                                    radius={[2, 2, 0, 0]}
                                    barSize={12}
                                />
                                <Bar
                                    name="Aktif"
                                    dataKey="aktif"
                                    fill={colors.aktif}
                                    radius={[2, 2, 0, 0]}
                                    barSize={12}
                                />
                                <Bar
                                    name="Dikembalikan"
                                    dataKey="dikembalikan"
                                    fill={colors.dikembalikan}
                                    radius={[2, 2, 0, 0]}
                                    barSize={12}
                                />
                                <Bar
                                    name="Dibatalkan"
                                    dataKey="dibatalkan"
                                    fill={colors.dibatalkan}
                                    radius={[2, 2, 0, 0]}
                                    barSize={12}
                                />
                                <Bar
                                    name="Terlambat"
                                    dataKey="terlambat"
                                    fill={colors.terlambat}
                                    radius={[2, 2, 0, 0]}
                                    barSize={12}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </div>
    );
};

export default MonthlyChart;
