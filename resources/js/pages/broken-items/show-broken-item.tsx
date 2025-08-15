import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { BrokenItemReport } from "@/types/broken-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ShowBrokenItemProps {
    report: BrokenItemReport;
    canUpdateStatus: boolean;
}

export default function ShowBrokenItem({
    report,
    canUpdateStatus,
}: ShowBrokenItemProps) {
    const [openItemImage, setOpenItemImage] = useState(false);
    const [openProofImage, setOpenProofImage] = useState(false);

    // Status color mapping to match columns.tsx
    const statusColorMap: Record<string, string> = {
        reported:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        repair_requested:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        in_repair:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        repaired:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    const statusTextMap: Record<string, string> = {
        reported: "Dilaporkan",
        repair_requested: "Perbaikan Diminta",
        in_repair: "Dalam Perbaikan",
        repaired: "Sudah Diperbaiki",
        rejected: "Ditolak",
    };

    const statusColorClass =
        statusColorMap[report.status] ||
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    const statusText = statusTextMap[report.status] || report.status;

    return (
        <AuthenticatedLayout>
            <Head title="Detail Laporan Barang Rusak" />
            <div className="container mx-auto p-4 max-w-6xl">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Main Content - Left Side */}
                    <div className="flex-1 space-y-6">
                        {/* Header with Title and Back Button */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Detail Laporan Barang Rusak
                            </h1>
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <Link
                                    href={route("dashboard.broken-items.index")}
                                >
                                    Kembali
                                </Link>
                            </Button>
                        </div>

                        {/* Item Information */}
                        <Card className="shadow-sm">
                            <CardHeader className="p-5 pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Informasi Barang
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 pt-0 space-y-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Nama Barang
                                    </p>
                                    <p className="text-sm font-medium">
                                        {report.item.nama_barang}
                                    </p>
                                </div>
                                {report.item.image && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                            Gambar Barang
                                        </p>
                                        <Dialog
                                            open={openItemImage}
                                            onOpenChange={setOpenItemImage}
                                        >
                                            <DialogTrigger asChild>
                                                <button className="cursor-pointer">
                                                    <img
                                                        src={`/storage/${report.item.image}`}
                                                        alt={
                                                            report.item
                                                                .nama_barang
                                                        }
                                                        className="h-32 w-auto object-contain rounded-lg border hover:opacity-90 transition-opacity"
                                                    />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
                                                <img
                                                    src={`/storage/${report.item.image}`}
                                                    alt={
                                                        report.item.nama_barang
                                                    }
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card className="shadow-sm">
                            <CardHeader className="p-5 pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Deskripsi Kerusakan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 pt-0">
                                <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    <p className="text-sm whitespace-pre-line text-gray-800 dark:text-gray-200">
                                        {report.description || "-"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Proof Image */}
                        {report.proof_image_path && (
                            <Card className="shadow-sm">
                                <CardHeader className="p-5 pb-3">
                                    <CardTitle className="text-base font-semibold">
                                        Bukti Foto Kerusakan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-5 pt-0">
                                    <Dialog
                                        open={openProofImage}
                                        onOpenChange={setOpenProofImage}
                                    >
                                        <DialogTrigger asChild>
                                            <button className="cursor-pointer">
                                                <img
                                                    src={`/storage/${report.proof_image_path}`}
                                                    alt="Bukti Kerusakan"
                                                    className="w-full h-auto max-h-64 object-contain rounded-lg border hover:opacity-90 transition-opacity"
                                                />
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
                                            <img
                                                src={`/storage/${report.proof_image_path}`}
                                                alt="Bukti Kerusakan"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="md:w-80 space-y-6">
                        {/* Status Update Section */}
                        {canUpdateStatus && (
                            <Card className="shadow-sm">
                                <CardHeader className="p-5 pb-3">
                                    <CardTitle className="text-base font-semibold">
                                        Update Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-5 pt-0 space-y-3">
                                    <Button
                                        asChild
                                        size="sm"
                                        className="w-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                                    >
                                        <Link
                                            href={route(
                                                "dashboard.broken-items.update",
                                                report.id
                                            )}
                                            data={{ status: "in_repair" }}
                                            method="put"
                                        >
                                            Mulai Perbaikan
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="w-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-green-600 hover:text-white dark:hover:bg-green-600"
                                    >
                                        <Link
                                            href={route(
                                                "dashboard.broken-items.update",
                                                report.id
                                            )}
                                            data={{ status: "repaired" }}
                                            method="put"
                                        >
                                            Tandai Selesai
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="w-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-red-600 hover:text-white dark:hover:bg-red-600"
                                    >
                                        <Link
                                            href={route(
                                                "dashboard.broken-items.update",
                                                report.id
                                            )}
                                            data={{ status: "rejected" }}
                                            method="put"
                                        >
                                            Tolak Laporan
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Report Details */}
                        <Card className="shadow-sm">
                            <CardHeader className="p-5 pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Detail Laporan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 pt-0 space-y-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Status
                                    </p>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColorClass}`}
                                    >
                                        {statusText}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Pelapor
                                    </p>
                                    <p className="text-sm font-medium">
                                        {report.reporter.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Tanggal Laporan
                                    </p>
                                    <p className="text-sm font-medium">
                                        {new Date(
                                            report.created_at
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                {report.repair_requester_id && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                            Permintaan Perbaikan
                                        </p>
                                        <p className="text-sm font-medium">
                                            {report.repairRequester?.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(
                                                report.repair_requested_at!
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Repair Notes */}
                        {report.repair_notes && (
                            <Card className="shadow-sm">
                                <CardHeader className="p-5 pb-3">
                                    <CardTitle className="text-base font-semibold">
                                        Catatan Perbaikan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-5 pt-0">
                                    <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        <p className="text-sm whitespace-pre-line text-gray-800 dark:text-gray-200">
                                            {report.repair_notes}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
