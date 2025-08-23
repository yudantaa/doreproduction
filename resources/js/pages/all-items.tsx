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
    ArrowRight,
    Star,
    Heart,
    Calendar,
    Clock,
    Shield,
    Users,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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
    type ThisItem = (typeof items)[number];
    const [selectedItem, setSelectedItem] = useState<ThisItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState("name");

    useEffect(() => {
        const handleScroll = () => {
            setIsHeaderSticky(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);

        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 500);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(timer);
        };
    }, []);

    const filteredItems = items.filter((item) => {
        const matchesSearch = item.nama_barang
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" ||
            item.id_kategori === parseInt(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    // Sort items based on selected criteria
    const sortedItems = [...filteredItems].sort((a, b) => {
        if (sortBy === "name") {
            return a.nama_barang.localeCompare(b.nama_barang);
        } else if (sortBy === "availability") {
            return b.jumlah - a.jumlah;
        }
        return 0;
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    const paginatedItems = sortedItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All");
        setSortBy("name");
        setCurrentPage(1);
    };

    const getWhatsAppLink = (item: { nama_barang: string }) =>
        `https://wa.me/089522734461?text=${encodeURIComponent(
            `Halo Dore Production, saya tertarik untuk menyewa *${item.nama_barang}*. Mohon informasi lebih lanjut.`
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col">
            <Head title="Semua Peralatan - Dore Production" />

            {/* Header */}
            <header
                className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 ${
                    isHeaderSticky ? "sticky top-0 z-50 shadow-lg" : ""
                } transition-all duration-300`}
            >
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/">
                        <div className="flex items-center group">
                            <div className="w-10 h-10 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110">
                                <img
                                    src="/logo.jpg"
                                    alt="Dore Production Logo"
                                    className="h-8 w-8 object-contain rounded-lg"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-black dark:text-white group-hover:text-red-700 dark:group-hover:text-red-600 transition-colors">
                                Dore{" "}
                                <span className="text-red-700 dark:text-red-600">
                                    Production
                                </span>
                            </h3>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        <AppearanceDropdown />
                        {isAuthenticated ? (
                            <Link href="/dashboard">
                                <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 hover:opacity-90 transition-opacity shadow-md"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 dark:border-gray-600 shadow-sm"
                                >
                                    Login
                                </Button>
                            </Link>
                        )}
                        <button
                            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    {/* Hero Section */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Katalog Peralatan Kami
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Temukan peralatan profesional terbaik untuk acara
                            Anda. Semua peralatan kami dirawat dengan standar
                            tinggi dan siap mendukung kesuksesan acara Anda.
                        </p>
                    </div>

                    {/* Filter Section */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-8">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                            <Filter className="w-5 h-5" /> Cari & Filter
                            Peralatan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="lg:col-span-2 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    placeholder="Cari barang..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-12 h-12 rounded-xl"
                                />
                            </div>
                            <Select
                                value={selectedCategory}
                                onValueChange={(value) => {
                                    setSelectedCategory(value);
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="h-12 rounded-xl">
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
                                value={sortBy}
                                onValueChange={(value) => {
                                    setSortBy(value);
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="h-12 rounded-xl">
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">
                                        Nama A-Z
                                    </SelectItem>
                                    <SelectItem value="availability">
                                        Ketersediaan
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={(value) => {
                                    setItemsPerPage(parseInt(value));
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="h-12 rounded-xl">
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
                                </SelectContent>
                            </Select>
                        </div>

                        {(searchTerm || selectedCategory !== "All") && (
                            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Menemukan {filteredItems.length} hasil
                                    {searchTerm && ` untuk "${searchTerm}"`}
                                    {selectedCategory !== "All" &&
                                        ` dalam ${getCategoryName(
                                            parseInt(selectedCategory)
                                        )}`}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="rounded-lg"
                                >
                                    <X className="w-4 h-4 mr-1" /> Bersihkan
                                    Filter
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Items Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {Array.from({ length: itemsPerPage }).map(
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-transform hover:scale-[1.02]"
                                    >
                                        <Skeleton className="aspect-[4/3] w-full" />
                                        <div className="p-3 md:p-5 space-y-3">
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-10 w-full rounded-xl" />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-16 bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-md">
                            <Package className="w-20 h-20 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">
                                Tidak ada peralatan ditemukan
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Coba gunakan kata kunci atau filter yang berbeda
                            </p>
                            <Button onClick={clearFilters}>Reset Filter</Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {paginatedItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group flex flex-col h-full hover:-translate-y-1"
                                    >
                                        <div
                                            className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden cursor-pointer"
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            {item.image ? (
                                                <img
                                                    src={`/storage/${item.image}`}
                                                    alt={item.nama_barang}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                                                    <img
                                                        src={`/placeholders/${getCategorySlug(
                                                            item.id_kategori
                                                        )}-placeholder.jpg`}
                                                        alt={item.nama_barang}
                                                        className="w-full h-full object-cover opacity-70"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <Badge
                                                    className={`${
                                                        item.status ===
                                                        "Tersedia"
                                                            ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                                    } font-medium py-1 px-2 text-xs`}
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    {item.status}
                                                </Badge>
                                            </div>
                                            <div className="absolute top-3 right-3">
                                                <Badge
                                                    variant="outline"
                                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-xs"
                                                >
                                                    {getCategoryName(
                                                        item.id_kategori
                                                    )}
                                                </Badge>
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <Button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs md:text-sm">
                                                    <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />{" "}
                                                    Lihat Detail
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="p-3 md:p-5 flex flex-col flex-grow">
                                            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-red-700 dark:group-hover:text-red-600 transition-colors">
                                                {item.nama_barang}
                                            </h3>
                                            {item.deskripsi && (
                                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                                    {item.deskripsi}
                                                </p>
                                            )}
                                            <div className="flex justify-between items-center text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                <span className="flex items-center">
                                                    <Package className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                                    Stok: {item.jumlah}
                                                </span>
                                                <span className="flex items-center">
                                                    <Shield className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                                    Garansi
                                                </span>
                                            </div>
                                            <div className="mt-auto">
                                                <a
                                                    href={getWhatsAppLink(item)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block"
                                                >
                                                    <Button
                                                        className="w-full bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 hover:from-gray-800 hover:to-gray-600 dark:hover:from-gray-200 dark:hover:to-gray-400 text-white dark:text-gray-900 h-10 md:h-11 rounded-xl font-medium shadow-md hover:shadow-lg transition-all text-xs md:text-sm"
                                                        disabled={
                                                            item.status !==
                                                            "Tersedia"
                                                        }
                                                    >
                                                        <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                                        {item.status ===
                                                        "Tersedia"
                                                            ? "Pesan Sekarang"
                                                            : "Tidak Tersedia"}
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Item Detail Dialog */}
                            <Dialog
                                open={isDialogOpen}
                                onOpenChange={setIsDialogOpen}
                            >
                                <DialogContent className="w-[95vw] max-w-4xl overflow-y-auto max-h-[90vh] rounded-2xl">
                                    {selectedItem && (
                                        <>
                                            <DialogHeader className="pb-4">
                                                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {selectedItem.nama_barang}
                                                </DialogTitle>
                                                <DialogDescription className="text-gray-500 dark:text-gray-400">
                                                    {getCategoryName(
                                                        selectedItem.id_kategori
                                                    )}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700">
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
                                                </div>
                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                                            Deskripsi
                                                        </h4>
                                                        <p className="text-gray-600 dark:text-gray-400">
                                                            {selectedItem.deskripsi ||
                                                                "Tidak ada deskripsi tersedia."}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                                                            <div className="flex items-center mb-2">
                                                                <Package className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
                                                                <h5 className="font-medium text-gray-900 dark:text-white">
                                                                    Stok
                                                                    Tersedia
                                                                </h5>
                                                            </div>
                                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                {
                                                                    selectedItem.jumlah
                                                                }{" "}
                                                                unit
                                                            </p>
                                                        </div>
                                                        {/* <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                                                            <div className="flex items-center mb-2">
                                                                <Clock className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
                                                                <h5 className="font-medium text-gray-900 dark:text-white">
                                                                    Periode Sewa
                                                                </h5>
                                                            </div>
                                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                                Harian/Mingguan/Bulanan
                                                            </p>
                                                        </div> */}
                                                    </div>

                                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/50">
                                                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                                                            <Shield className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                                                            termasuk garansi
                                                        </h5>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Semua peralatan kami
                                                            termasuk garansi
                                                            kerusakan selama
                                                            penyewaan
                                                        </p>
                                                    </div>

                                                    <a
                                                        href={getWhatsAppLink(
                                                            selectedItem
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block"
                                                    >
                                                        <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-12 rounded-xl text-base font-medium shadow-md hover:shadow-lg transition-all">
                                                            <Phone className="w-5 h-5 mr-2" />
                                                            Pesan via WhatsApp
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </DialogContent>
                            </Dialog>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-8 mt-8 gap-4">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Menampilkan{" "}
                                        <span className="font-medium">
                                            {(currentPage - 1) * itemsPerPage +
                                                1}
                                        </span>{" "}
                                        -{" "}
                                        <span className="font-medium">
                                            {Math.min(
                                                currentPage * itemsPerPage,
                                                sortedItems.length
                                            )}
                                        </span>{" "}
                                        dari{" "}
                                        <span className="font-medium">
                                            {sortedItems.length}
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
                                            className="rounded-lg"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Sebelumnya
                                        </Button>
                                        <div className="flex items-center space-x-1">
                                            {Array.from(
                                                {
                                                    length: Math.min(
                                                        5,
                                                        totalPages
                                                    ),
                                                },
                                                (_, i) => {
                                                    let pageNum;
                                                    if (totalPages <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (
                                                        currentPage <= 3
                                                    ) {
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
                                                            className="rounded-lg w-10 h-10 p-0"
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    );
                                                }
                                            )}
                                            {totalPages > 5 &&
                                                currentPage <
                                                    totalPages - 2 && (
                                                    <span className="px-2 text-gray-500">
                                                        ...
                                                    </span>
                                                )}
                                            {totalPages > 5 &&
                                                currentPage <
                                                    totalPages - 2 && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                totalPages
                                                            )
                                                        }
                                                        className="rounded-lg"
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
                                                    Math.min(
                                                        prev + 1,
                                                        totalPages
                                                    )
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="rounded-lg"
                                        >
                                            Selanjutnya
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-b from-gray-900 to-gray-950 dark:from-gray-950 dark:to-black py-12 text-gray-300 dark:text-gray-400 border-t border-gray-800 dark:border-gray-900 mt-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                                    <img
                                        src="/logo.jpg"
                                        alt="Dore Production Logo"
                                        className="h-8 w-8 object-contain rounded-lg"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    Dore{" "}
                                    <span className="text-red-600">
                                        Production
                                    </span>
                                </h3>
                            </div>
                            <p className="text-sm mb-6">
                                Solusi pencahayaan profesional untuk produksi
                                film, fotografi, dan acara.
                            </p>
                            <div className="flex space-x-3">
                                <a
                                    href="https://www.instagram.com/doreproduction/"
                                    className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a
                                    href="https://www.facebook.com/Dorepro/"
                                    className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-white mb-4 text-lg">
                                Peralatan
                            </h4>
                            <ul className="space-y-3 text-sm">
                                {categories.slice(0, 5).map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={`/peralatan/`}
                                            className="hover:text-white transition-colors flex items-center"
                                        >
                                            <ArrowRight className="w-3 h-3 mr-2" />{" "}
                                            {category.nama_kategori}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-white mb-4 text-lg">
                                Links
                            </h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <a
                                        href="./#tentang"
                                        className="hover:text-white transition-colors flex items-center"
                                    >
                                        <ArrowRight className="w-3 h-3 mr-2" />{" "}
                                        Tentang Kami
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="./#proyek"
                                        className="hover:text-white transition-colors flex items-center"
                                    >
                                        <ArrowRight className="w-3 h-3 mr-2" />{" "}
                                        Proyek
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="./#testimonial"
                                        className="hover:text-white transition-colors flex items-center"
                                    >
                                        <ArrowRight className="w-3 h-3 mr-2" />{" "}
                                        Testimonial
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="./#kontak"
                                        className="hover:text-white transition-colors flex items-center"
                                    >
                                        <ArrowRight className="w-3 h-3 mr-2" />{" "}
                                        Kontak
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-white mb-4 text-lg">
                                Kontak
                            </h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start">
                                    <MapPin className="w-4 h-4 mr-3 mt-0.5 shrink-0" />
                                    <span>
                                        Jalan Sedap Malam Gg Rampai 1b no 22,
                                        Denpasar, Indonesia, Bali
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <Mail className="w-4 h-4 mr-3 mt-0.5 shrink-0" />
                                    <span>info@doreproduction.id</span>
                                </li>
                                <li className="flex items-start">
                                    <Phone className="w-4 h-4 mr-3 mt-0.5 shrink-0" />
                                    <span>0819-1640-2006</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm">
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
