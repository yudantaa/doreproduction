import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Package,
    Search,
    Filter,
    X,
    Menu,
    Instagram,
    Facebook,
    MapPin,
    Mail,
    Phone,
    ChevronRight,
    ChevronLeft,
    CheckCircle,
    Eye,
} from "lucide-react";
import AppearanceDropdown from "@/components/appearance-dropdown";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface AllItemsPageProps {
    items: Array<{
        id: string;
        nama_barang: string;
        deskripsi?: string;
        jumlah: number;
        status: string;
        image?: string;
        id_kategori: number;
    }>;
    categories: Array<{
        id: number;
        nama_kategori: string;
    }>;
    isAuthenticated?: boolean;
}

export default function AllItemsPage({
    items,
    categories,
    isAuthenticated = false,
}: AllItemsPageProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsHeaderSticky(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            false;
        const matchesCategory =
            selectedCategory === "All" ||
            item.id_kategori === parseInt(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All");
        setCurrentPage(1);
    };

    const getWhatsAppLink = (item: { nama_barang: string }) =>
        `https://wa.me/089522734461?text=${encodeURIComponent(
            `Halo saya mau sewa ${item.nama_barang}`
        )}`;

    const getCategoryName = (categoryId: number) =>
        categories.find((c) => c.id === categoryId)?.nama_kategori || "-";

    const getCategorySlug = (categoryId: number) => {
        const category = categories.find((c) => c.id === categoryId);
        if (!category) return "default";
        return category.nama_kategori
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Head title="Semua Peralatan - Dore Production" />
            <header
                className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${
                    isHeaderSticky ? "sticky top-0 z-50 shadow-sm" : ""
                }`}
            >
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center mr-2">
                                <img
                                    src="/logo.jpg"
                                    alt="Dore Production Logo"
                                    className="h-full w-full object-contain rounded-lg"
                                />
                            </div>
                            <h3 className="text-lg font-bold text-black dark:text-white">
                                Dore{" "}
                                <span className="text-red-700 dark:text-red-600">
                                    Production
                                </span>
                            </h3>
                        </div>
                    </Link>
                    <nav className="hidden md:flex space-x-6 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm font-medium">
                        <Link href="/">Kembali ke Homepage</Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <AppearanceDropdown />
                        {isAuthenticated ? (
                            <Link href="/dashboard">
                                <Button
                                    size="sm"
                                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button variant="outline" size="sm">
                                    Login
                                </Button>
                            </Link>
                        )}
                        <a href="https://wa.me/089522734461">
                            <Button size="sm" className="hidden md:flex">
                                Hubungi Kami
                            </Button>
                        </a>
                        <button
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </header>

            <section className="py-10 flex-1 container mx-auto px-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border mb-8">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Filter className="w-5 h-5" /> Cari & Filter Peralatan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Cari barang..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => {
                                setSelectedCategory(value);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">
                                    Semua Kategori
                                </SelectItem>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id.toString()}
                                    >
                                        {category.nama_kategori}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(value) => {
                                setItemsPerPage(parseInt(value));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Item per halaman" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12">
                                    12 per halaman
                                </SelectItem>
                                <SelectItem value="24">
                                    24 per halaman
                                </SelectItem>
                                <SelectItem value="48">
                                    48 per halaman
                                </SelectItem>
                                <SelectItem value="96">
                                    96 per halaman
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center justify-end">
                            {(searchTerm || selectedCategory !== "All") && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearFilters}
                                >
                                    <X className="w-4 h-4 mr-1" /> Bersihkan
                                    Filter
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">
                            Tidak ada peralatan ditemukan
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Coba gunakan kata kunci atau filter yang berbeda
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {paginatedItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden group"
                                >
                                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                        {item.image ? (
                                            <img
                                                src={`/storage/${item.image}`}
                                                alt={item.nama_barang}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                                <img
                                                    src={`/placeholders/${getCategorySlug(
                                                        item.id_kategori
                                                    )}-placeholder.jpg`}
                                                    alt={item.nama_barang}
                                                    className="w-full h-full object-cover opacity-70"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                    item.status === "Tersedia"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                            >
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                {item.status}
                                            </span>
                                        </div>
                                        <button
                                            className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                                                {item.nama_barang}
                                            </h3>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Kategori:{" "}
                                                {getCategoryName(
                                                    item.id_kategori
                                                )}
                                            </span>
                                        </div>
                                        {item.deskripsi && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                {item.deskripsi}
                                            </p>
                                        )}
                                        <div className="flex justify-between items-center mb-3 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center">
                                                <Package className="w-3 h-3 mr-1" />
                                                Stok: {item.jumlah}
                                            </span>
                                        </div>
                                        <a
                                            href={getWhatsAppLink(item)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <Button
                                                className="w-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 text-sm h-9 font-medium"
                                                disabled={
                                                    item.status !== "Tersedia"
                                                }
                                            >
                                                <Phone className="w-4 h-4 mr-2" />
                                                {item.status === "Tersedia"
                                                    ? "Pesan Sekarang"
                                                    : "Tidak Tersedia"}
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Item Detail Dialog */}
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogContent className="w-full max-w-xl overflow-y-auto">
                                {selectedItem && (
                                    <>
                                        <DialogHeader className="pb-4">
                                            <DialogTitle className="text-xl font-bold">
                                                {selectedItem.nama_barang}
                                            </DialogTitle>
                                            <DialogDescription className="text-gray-500">
                                                Informasi lengkap peralatan
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700">
                                            {selectedItem.image ? (
                                                <img
                                                    src={`/storage/${selectedItem.image}`}
                                                    alt={
                                                        selectedItem.nama_barang
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <img
                                                        src={`/placeholders/${getCategorySlug(
                                                            selectedItem.id_kategori
                                                        )}-placeholder.jpg`}
                                                        alt={
                                                            selectedItem.nama_barang
                                                        }
                                                        className="w-full h-full object-cover opacity-70"
                                                    />
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                                                        selectedItem.status ===
                                                        "Tersedia"
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                    }`}
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    {selectedItem.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto max-h-40 mb-4">
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                Deskripsi
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                                {selectedItem.deskripsi ||
                                                    "Tidak ada deskripsi tersedia."}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Kategori
                                                </p>
                                                <p className="text-lg font-bold">
                                                    {getCategoryName(
                                                        selectedItem.id_kategori
                                                    )}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Stok Tersedia
                                                </p>
                                                <p className="text-lg font-bold">
                                                    {selectedItem.jumlah} unit
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <a
                                                href={getWhatsAppLink(
                                                    selectedItem
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1"
                                            >
                                                <Button className="w-full">
                                                    <Phone className="w-4 h-4 mr-2" />{" "}
                                                    Pesan Sekarang
                                                </Button>
                                            </a>
                                        </div>
                                    </>
                                )}
                            </DialogContent>
                        </Dialog>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Menampilkan{" "}
                                    <span className="font-medium">
                                        {(currentPage - 1) * itemsPerPage + 1}
                                    </span>{" "}
                                    -{" "}
                                    <span className="font-medium">
                                        {Math.min(
                                            currentPage * itemsPerPage,
                                            filteredItems.length
                                        )}
                                    </span>{" "}
                                    dari{" "}
                                    <span className="font-medium">
                                        {filteredItems.length}
                                    </span>{" "}
                                    hasil
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.max(prev - 1, 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Sebelumnya
                                    </Button>
                                    <div className="flex items-center space-x-1">
                                        {Array.from(
                                            { length: Math.min(5, totalPages) },
                                            (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (
                                                    currentPage >=
                                                    totalPages - 2
                                                ) {
                                                    pageNum =
                                                        totalPages - 4 + i;
                                                } else {
                                                    pageNum =
                                                        currentPage - 2 + i;
                                                }
                                                return (
                                                    <Button
                                                        key={pageNum}
                                                        variant={
                                                            currentPage ===
                                                            pageNum
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                pageNum
                                                            )
                                                        }
                                                    >
                                                        {pageNum}
                                                    </Button>
                                                );
                                            }
                                        )}
                                        {totalPages > 5 &&
                                            currentPage < totalPages - 2 && (
                                                <span className="px-2">
                                                    ...
                                                </span>
                                            )}
                                        {totalPages > 5 &&
                                            currentPage < totalPages - 2 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            totalPages
                                                        )
                                                    }
                                                >
                                                    {totalPages}
                                                </Button>
                                            )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                    >
                                        Selanjutnya
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>

            <footer className="bg-gray-900 dark:bg-gray-950 py-8 text-gray-300 dark:text-gray-400 border-t border-gray-800 dark:border-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                                    <img
                                        src="/logo.jpg"
                                        alt="Dore Production Logo"
                                        className="h-full w-full object-contain rounded-lg"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    Dore{" "}
                                    <span className="text-red-700 dark:text-red-600">
                                        Production
                                    </span>
                                </h3>
                            </div>
                            <p className="text-sm mb-4">
                                Solusi pencahayaan profesional untuk produksi
                                film, fotografi, dan acara.
                            </p>
                            <div className="flex space-x-3">
                                <a
                                    href="https://www.instagram.com/doreproduction/"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a
                                    href="https://www.facebook.com/Dorepro/"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-white mb-3">
                                Peralatan
                            </h4>
                            <ul className="space-y-2 text-sm">
                                {categories.slice(0, 5).map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={`/peralatan/`}
                                            className="hover:text-white transition-colors"
                                        >
                                            {category.nama_kategori}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-white mb-3">
                                Links
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="./#tentang"
                                        className="hover:text-white transition-colors"
                                    >
                                        Tentang Kami
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="./#proyek"
                                        className="hover:text-white transition-colors"
                                    >
                                        Proyek
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="./#testimonial"
                                        className="hover:text-white transition-colors"
                                    >
                                        Testimonial
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="./#kontak"
                                        className="hover:text-white transition-colors"
                                    >
                                        Kontak
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-white mb-3">
                                Kontak
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start">
                                    <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                                    <span>
                                        Jalan Sedap Malam Gg Rampai 1b no 22,
                                        Denpasar, Indonesia, Bali
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <Mail className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                                    <span>info@doreproduction.id</span>
                                </li>
                                <li className="flex items-start">
                                    <Phone className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                                    <span>0819-1640-2006</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-6 text-center text-xs">
                        <p>
                            &copy; {new Date().getFullYear()} Dore Production.
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
