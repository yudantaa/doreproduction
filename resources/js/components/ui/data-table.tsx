"use client";

import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnDef,
    getSortedRowModel,
    SortingState,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    X,
    Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageSize?: number;
    pageSizeOptions?: number[];
    enablePagination?: boolean;
    enableSorting?: boolean;
    enableGlobalFilter?: boolean;
    className?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    loadingMessage?: string;
    isLoading?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    enablePagination = true,
    enableSorting = true,
    enableGlobalFilter = false,
    className,
    searchPlaceholder = "Cari data...",
    emptyMessage = "Tidak ada data ditemukan.",
    loadingMessage = "Memuat data...",
    isLoading = false,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize,
    });

    const safeData = React.useMemo(() => {
        if (!data || !Array.isArray(data)) {
            console.warn(
                "DataTable: data prop is not an array, using empty array"
            );
            return [];
        }
        return data;
    }, [data]);

    const safeColumns = React.useMemo(() => {
        if (!columns || !Array.isArray(columns)) {
            console.warn(
                "DataTable: columns prop is not an array, using empty array"
            );
            return [];
        }
        return columns.map((column) => ({
            ...column,
            enableSorting: column.enableSorting !== false && enableSorting,
        }));
    }, [columns, enableSorting]);

    const table = useReactTable({
        data: safeData,
        columns: safeColumns,
        state: {
            pagination,
            sorting,
            columnFilters,
            globalFilter,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: enablePagination
            ? getPaginationRowModel()
            : undefined,
        getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
        getFilteredRowModel: enableGlobalFilter
            ? getFilteredRowModel()
            : undefined,
        globalFilterFn: "includesString",
    });

    React.useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [safeData, globalFilter]);

    if (safeColumns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-32 p-8 text-center border border-dashed border-muted-foreground/25 rounded-lg bg-muted/10">
                <Filter className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground font-medium">
                    Tidak ada kolom yang didefinisikan
                </p>
                <p className="text-xs text-muted-foreground/70">
                    Periksa konfigurasi tabel Anda
                </p>
            </div>
        );
    }

    const totalRows = table.getFilteredRowModel().rows.length;
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    const startRow =
        table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
        1;
    const endRow = Math.min(
        startRow + table.getState().pagination.pageSize - 1,
        totalRows
    );

    return (
        <div className={cn("flex flex-col space-y-4", className)}>
            {enableGlobalFilter && (
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={globalFilter ?? ""}
                            onChange={(event) =>
                                setGlobalFilter(event.target.value)
                            }
                            className="pl-10 pr-10"
                        />
                        {globalFilter && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setGlobalFilter("")}
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </div>
            )}

            <div className="relative border border-border rounded-lg bg-card shadow-sm">
                {isLoading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                            <span>{loadingMessage}</span>
                        </div>
                    </div>
                )}

                <div className="hidden lg:block overflow-auto max-h-[70vh]">
                    <Table>
                        <TableHeader className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="border-b border-border hover:bg-transparent"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap"
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={cn(
                                                        "flex items-center",
                                                        header.column.getCanSort() &&
                                                            "cursor-pointer select-none hover:text-foreground transition-colors"
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                                    {header.column.getCanSort() && (
                                                        <ArrowUpDown className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                        className={cn(
                                            "border-b border-border/50 hover:bg-muted/50 transition-colors",
                                            index % 2 === 0
                                                ? "bg-background"
                                                : "bg-muted/10"
                                        )}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="px-4 py-3 align-top"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={safeColumns.length}
                                        className="h-32 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center py-8">
                                            <Search className="h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {emptyMessage}
                                            </p>
                                            {globalFilter && (
                                                <p className="text-xs text-muted-foreground/70 mt-1">
                                                    Coba ubah kata kunci
                                                    pencarian Anda
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="lg:hidden space-y-3 p-4 max-h-[70vh] overflow-auto">
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row, index) => (
                            <div
                                key={row.id}
                                className="border border-border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition-all duration-200 space-y-3"
                            >
                                {row
                                    .getVisibleCells()
                                    .map((cell, cellIndex) => {
                                        const header =
                                            safeColumns[cellIndex]?.header;
                                        let headerText = "";

                                        if (typeof header === "string") {
                                            headerText = header;
                                        } else if (
                                            typeof header === "function"
                                        ) {
                                            const headerElement = flexRender(
                                                header as any,
                                                { column: cell.column } as any
                                            );
                                            headerText = String(headerElement);
                                        } else {
                                            headerText = `Kolom ${
                                                cellIndex + 1
                                            }`;
                                        }

                                        return (
                                            <div
                                                key={cell.id}
                                                className="flex flex-col text-sm"
                                            >
                                                <div className="font-medium text-muted-foreground mb-1">
                                                    {headerText}
                                                </div>
                                                <div>
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext()
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                            <p className="text-sm font-medium">
                                {emptyMessage}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {enablePagination && totalRows > 0 && (
                <div className="flex flex-col space-y-3 p-3 border-t border-border bg-background/50 rounded-b-lg">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                            Menampilkan {startRow} - {endRow} dari {totalRows}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                Baris:
                            </span>
                            <Select
                                value={String(
                                    table.getState().pagination.pageSize
                                )}
                                onValueChange={(value) =>
                                    table.setPageSize(Number(value))
                                }
                            >
                                <SelectTrigger className="h-8 w-16">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {pageSizeOptions.map((size) => (
                                        <SelectItem
                                            key={size}
                                            value={String(size)}
                                        >
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-1">
                            <div className="text-xs text-muted-foreground mx-2 whitespace-nowrap">
                                {currentPage} / {totalPages}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                                className="h-8 w-8 p-0 hidden sm:flex"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    table.setPageIndex(table.getPageCount() - 1)
                                }
                                disabled={!table.getCanNextPage()}
                                className="h-8 w-8 p-0 hidden sm:flex"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
