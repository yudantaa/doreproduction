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
    LabelList,
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
        label: "Telat",
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
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => {
    const currentYear = new Date().getFullYear();

    // If no data is provided, show a message
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Data Pinjaman Bulanan</CardTitle>
                    <CardDescription>Tahun {currentYear}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Tidak ada pinjaman.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Pinjaman Bulanan</CardTitle>
                <CardDescription>
                    Tahun <b>{currentYear}</b>
                </CardDescription>
            </CardHeader>
            <CardContent className="w-full overflow-hidden">
                {/* Fixed height with proper responsive container */}
                <ChartContainer
                    config={chartConfig}
                    className="h-64 md:h-80 w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 10,
                                left: 10,
                                bottom: 20,
                            }}
                            barCategoryGap="20%"
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                                fontSize={12}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                                fontSize={12}
                                width={40}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend
                                wrapperStyle={{ fontSize: "12px" }}
                                iconSize={10}
                            />
                            <Bar
                                dataKey="total"
                                fill="var(--color-total)"
                                radius={[2, 2, 0, 0]}
                                maxBarSize={20}
                            />
                            <Bar
                                dataKey="aktif"
                                fill="var(--color-aktif)"
                                radius={[2, 2, 0, 0]}
                                maxBarSize={20}
                            />
                            <Bar
                                dataKey="dikembalikan"
                                fill="var(--color-dikembalikan)"
                                radius={[2, 2, 0, 0]}
                                maxBarSize={20}
                            />
                            <Bar
                                dataKey="dibatalkan"
                                fill="var(--color-dibatalkan)"
                                radius={[2, 2, 0, 0]}
                                maxBarSize={20}
                            />
                            <Bar
                                dataKey="terlambat"
                                fill="var(--color-terlambat)"
                                radius={[2, 2, 0, 0]}
                                maxBarSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Menampilkan data pinjaman pada tahun {currentYear}
                </div>
            </CardFooter>
        </Card>
    );
};

export default MonthlyChart;
