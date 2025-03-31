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
    active: {
        label: "Aktif",
        color: "#3b82f6", // blue-500
    },
    returned: {
        label: "Dikembalikan",
        color: "#22c55e", // green-500
    },
    cancelled: {
        label: "Dibatalkan",
        color: "#f97316", // orange-500
    },
    overdue: {
        label: "Telat",
        color: "#ef4444", // red-500
    },
} satisfies ChartConfig;

export function MonthlyChart({ data = [] }) {
    const currentYear = new Date().getFullYear();

    // If no data is provided, show a message
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Data Pinjaman Bulanan</CardTitle>
                    <CardDescription>{currentYear}</CardDescription>
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
                <CardDescription>{currentYear}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar
                            dataKey="total"
                            fill="var(--color-total)"
                            radius={[4, 4, 0, 0]}
                            barSize={36}
                        />
                        <Bar
                            dataKey="active"
                            fill="var(--color-active)"
                            radius={[4, 4, 0, 0]}
                            barSize={36}
                        />
                        <Bar
                            dataKey="returned"
                            fill="var(--color-returned)"
                            radius={[4, 4, 0, 0]}
                            barSize={36}
                        />
                        <Bar
                            dataKey="cancelled"
                            fill="var(--color-cancelled)"
                            radius={[4, 4, 0, 0]}
                            barSize={36}
                        />
                        <Bar
                            dataKey="overdue"
                            fill="var(--color-overdue)"
                            radius={[4, 4, 0, 0]}
                            barSize={36}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Menampilkan data pinjaman pada tahun {currentYear}
                </div>
            </CardFooter>
        </Card>
    );
}

export default MonthlyChart;
