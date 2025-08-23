import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { BrokenItemReport } from "@/types/broken-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    User,
    Box,
    FileText,
    ImageIcon,
    Wrench,
    ArrowLeft,
    ClipboardList,
} from "lucide-react";

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

    // Status color mapping
    const statusColorMap: Record<string, string> = {
        reported: "bg-blue-100 text-blue-800 border-blue-200",
        repair_requested: "bg-amber-100 text-amber-800 border-amber-200",
        in_repair: "bg-violet-100 text-violet-800 border-violet-200",
        repaired: "bg-emerald-100 text-emerald-800 border-emerald-200",
        rejected: "bg-rose-100 text-rose-800 border-rose-200",
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
        "bg-gray-100 text-gray-800 border-gray-200";
    const statusText = statusTextMap[report.status] || report.status;

    return (
        <AuthenticatedLayout>
            <Head title="Detail Laporan Barang Rusak" />
            <div className="container mx-auto p-4 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Detail Laporan Barang Rusak
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Informasi lengkap tentang laporan kerusakan barang
                        </p>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Link href={route("dashboard.broken-items.index")}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Item Information */}
                        <Card className="shadow-sm border-0">
                            <CardHeader className="pb-3">
                                <div className="flex items-center">
                                    <Box className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <CardTitle className="text-lg font-semibold">
                                        Informasi Barang
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1 flex items-center">
                                            <ClipboardList className="h-3.5 w-3.5 mr-1" />
                                            Nama Barang
                                        </p>
                                        <p className="text-sm font-medium">
                                            {report.item.nama_barang}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1 flex items-center">
                                            <Box className="h-3.5 w-3.5 mr-1" />
                                            Kode Unit
                                        </p>
                                        <p className="text-sm font-medium">
                                            {report.itemUnit.kode_unit ||
                                                "Tidak tersedia"}
                                        </p>
                                    </div>
                                </div>
                                {report.item.image && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-2 flex items-center">
                                            <ImageIcon className="h-3.5 w-3.5 mr-1" />
                                            Gambar Barang
                                        </p>
                                        <Dialog
                                            open={openItemImage}
                                            onOpenChange={setOpenItemImage}
                                        >
                                            <DialogTrigger asChild>
                                                <button className="cursor-pointer transition-transform hover:scale-[1.02] duration-200">
                                                    <img
                                                        src={`/storage/${report.item.image}`}
                                                        alt={
                                                            report.item
                                                                .nama_barang
                                                        }
                                                        className="h-40 w-full object-cover rounded-lg border shadow-sm hover:shadow-md transition-all"
                                                    />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl p-0">
                                                <img
                                                    src={`/storage/${report.item.image}`}
                                                    alt={
                                                        report.item.nama_barang
                                                    }
                                                    className="w-full h-full max-h-[80vh] object-contain rounded-lg"
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card className="shadow-sm border-0">
                            <CardHeader className="pb-3">
                                <div className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <CardTitle className="text-lg font-semibold">
                                        Deskripsi Kerusakan
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/30 p-4 rounded-lg">
                                    <p className="text-sm whitespace-pre-line">
                                        {report.description ||
                                            "Tidak ada deskripsi yang diberikan"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Proof Image */}
                        {report.proof_image_path && (
                            <Card className="shadow-sm border-0">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center">
                                        <ImageIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                                        <CardTitle className="text-lg font-semibold">
                                            Bukti Foto Kerusakan
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Dialog
                                        open={openProofImage}
                                        onOpenChange={setOpenProofImage}
                                    >
                                        <DialogTrigger asChild>
                                            <button className="cursor-pointer transition-transform hover:scale-[1.02] duration-200">
                                                <img
                                                    src={`/storage/${report.proof_image_path}`}
                                                    alt="Bukti Kerusakan"
                                                    className="w-full h-64 object-cover rounded-lg border shadow-sm hover:shadow-md transition-all"
                                                />
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl p-0">
                                            <img
                                                src={`/storage/${report.proof_image_path}`}
                                                alt="Bukti Kerusakan"
                                                className="w-full h-full max-h-[80vh] object-contain rounded-lg"
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Update Section */}
                        {canUpdateStatus && (
                            <Card className="shadow-sm border-0">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center">
                                        <Wrench className="h-5 w-5 mr-2 text-muted-foreground" />
                                        <CardTitle className="text-lg font-semibold">
                                            Update Status
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        asChild
                                        className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                                    >
                                        <Link
                                            href={route(
                                                "dashboard.broken-items.update",
                                                report.id
                                            )}
                                            data={{ status: "in_repair" }}
                                            method="put"
                                        >
                                            <Wrench className="h-4 w-4 mr-2" />
                                            Mulai Perbaikan
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        className="w-full justify-start bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                    >
                                        <Link
                                            href={route(
                                                "dashboard.broken-items.update",
                                                report.id
                                            )}
                                            data={{ status: "repaired" }}
                                            method="put"
                                        >
                                            <Wrench className="h-4 w-4 mr-2" />
                                            Tandai Selesai
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        className="w-full justify-start bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                                    >
                                        <Link
                                            href={route(
                                                "dashboard.broken-items.update",
                                                report.id
                                            )}
                                            data={{ status: "rejected" }}
                                            method="put"
                                        >
                                            <Wrench className="h-4 w-4 mr-2" />
                                            Tolak Laporan
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Report Details */}
                        <Card className="shadow-sm border-0">
                            <CardHeader className="pb-3">
                                <div className="flex items-center">
                                    <ClipboardList className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <CardTitle className="text-lg font-semibold">
                                        Detail Laporan
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2 flex items-center">
                                        Status
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className={`${statusColorClass} px-3 py-1 rounded-full text-xs font-medium border`}
                                    >
                                        {statusText}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1 flex items-center">
                                        <User className="h-3.5 w-3.5 mr-1" />
                                        Pelapor
                                    </p>
                                    <p className="text-sm font-medium">
                                        {report.reporter.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1 flex items-center">
                                        <Calendar className="h-3.5 w-3.5 mr-1" />
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
                                            Permintaan Perbaikan Oleh
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
                            <Card className="shadow-sm border-0">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center">
                                        <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                                        <CardTitle className="text-lg font-semibold">
                                            Catatan Perbaikan
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <p className="text-sm whitespace-pre-line">
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
