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
import { ArrowUpDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageSize?: number;
    pageSizeOptions?: number[];
    enablePagination?: boolean;
    enableSorting?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageSize = 5,
    pageSizeOptions = [5, 10, 20, 50],
    enablePagination = true,
    enableSorting = true,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize,
    });

    // Ensure data is always an array to prevent undefined errors
    const safeData = React.useMemo(() => {
        if (!data || !Array.isArray(data)) {
            console.warn(
                "DataTable: data prop is not an array, using empty array"
            );
            return [];
        }
        return data;
    }, [data]);

    // Ensure columns is always an array
    const safeColumns = React.useMemo(() => {
        if (!columns || !Array.isArray(columns)) {
            console.warn(
                "DataTable: columns prop is not an array, using empty array"
            );
            return [];
        }
        return columns.map((column) => ({
            ...column,
            // Enable sorting by default for all columns unless explicitly disabled
            enableSorting: column.enableSorting !== false && enableSorting,
        }));
    }, [columns, enableSorting]);

    const table = useReactTable({
        data: safeData,
        columns: safeColumns,
        state: {
            pagination,
            sorting,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: enablePagination
            ? getPaginationRowModel()
            : undefined,
        getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    });

    if (safeColumns.length === 0) {
        return (
            <div className="flex items-center justify-center h-24 text-center text-gray-500">
                <p>No columns defined for table</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto max-h-[calc(100vh-300px)]">
                <Table className="min-w-full border-collapse">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="sticky top-0 z-20 bg-background text-sm border-b"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={`flex items-center ${
                                                    header.column.getCanSort()
                                                        ? "cursor-pointer select-none"
                                                        : ""
                                                }`}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanSort() && (
                                                    <ArrowUpDown className="ml-2 h-4 w-4" />
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
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    className="hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="py-3"
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
                                    className="h-24 text-center text-gray-500"
                                >
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Client-side Pagination - only show if enabled and data exists */}
            {enablePagination && safeData.length > 0 && (
                <div className="flex items-center justify-between px-2 py-2 border-t bg-background">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-white">
                            Jumlah data per halaman
                        </span>
                        <select
                            className="border rounded px-2 py-1 text-sm"
                            value={table.getState().pagination.pageSize}
                            onChange={(e) =>
                                table.setPageSize(Number(e.target.value))
                            }
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-white">
                            Halaman {table.getState().pagination.pageIndex + 1}{" "}
                            dari {table.getPageCount()}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Selanjutnya
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
