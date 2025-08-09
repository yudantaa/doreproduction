// Updated all-items.tsx with working pagination

import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item } from "./item/columns";
import { Category } from "./category/columns";
import AppearanceDropdown from "@/components/appearance-dropdown";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CheckCircle,
    Phone,
    Menu,
    X,
    Instagram,
    Facebook,
    Mail,
    MapPin,
    Package,
    Search,
    Filter,
    Eye,
} from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface AllItemsPageProps {
    items: Item[];
    categories: Category[];
    isAuthenticated?: boolean;
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
    links?: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function AllItemsPage({
    items,
    categories,
    isAuthenticated = false,
    current_page = 1,
    last_page = 1,
    per_page = 12,
    total = 0,
    links = [],
}: AllItemsPageProps) {
    const [filteredItems, setFilteredItems] = useState<Item[]>(items);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);

    // Client-side pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        const handleScroll = () => {
            setIsHeaderSticky(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        let filtered = items;
        if (searchTerm) {
            filtered = filtered.filter(
                (item) =>
                    item.nama_barang
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.deskripsi
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }
        if (selectedCategory !== "All") {
            filtered = filtered.filter(
                (item) => item.id_kategori === parseInt(selectedCategory)
            );
        }
        if (statusFilter !== "All") {
            filtered = filtered.filter((item) => item.status === statusFilter);
        }
        setFilteredItems(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [items, searchTerm, selectedCategory, statusFilter]);

    // Calculate pagination for filtered items
    const totalFilteredItems = filteredItems.length;
    const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(
                totalPages,
                startPage + maxPagesToShow - 1
            );

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    const getWhatsAppLink = (item: Item) =>
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

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All");
        setStatusFilter("All");
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: "smooth" });
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
                                <Phone className="w-4 h-4 mr-2" /> Hubungi Kami
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">
                                    Semua Kategori
                                </SelectItem>
                                {categories.map((c) => (
                                    <SelectItem
                                        key={c.id}
                                        value={c.id.toString()}
                                    >
                                        {c.nama_kategori}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">
                                    Semua Status
                                </SelectItem>
                                <SelectItem value="Tersedia">
                                    Tersedia
                                </SelectItem>
                                <SelectItem value="Disewa">Disewa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {(searchTerm ||
                        selectedCategory !== "All" ||
                        statusFilter !== "All") && (
                        <div className="mt-4 text-right">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                            >
                                <X className="w-4 h-4 mr-1" /> Bersihkan Filter
                            </Button>
                        </div>
                    )}
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
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {currentItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm hover:shadow-md group overflow-hidden transition-all"
                                    >
                                        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
                                            {item.image ? (
                                                <img
                                                    src={`/storage/${item.image}`}
                                                    alt={item.nama_barang}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
                                            <span
                                                className={`absolute top-2 left-2 px-2 py-1 text-xs rounded-full flex items-center ${
                                                    item.status === "Tersedia"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                }`}
                                            >
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                {item.status}
                                            </span>
                                            <DialogTrigger asChild>
                                                <button
                                                    className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setIsOpen(true);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </DialogTrigger>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold mb-1 line-clamp-1">
                                                {item.nama_barang}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                {getCategoryName(
                                                    item.id_kategori
                                                )}
                                            </p>
                                            <p className="text-xs mb-2 text-gray-500 dark:text-gray-400">
                                                Stok: {item.jumlah}
                                            </p>
                                            {item.status === "Tersedia" ? (
                                                <a
                                                    href={getWhatsAppLink(item)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button className="w-full text-sm">
                                                        <Phone className="w-4 h-4 mr-1" />
                                                        Pesan Sekarang
                                                    </Button>
                                                </a>
                                            ) : (
                                                <Button
                                                    disabled
                                                    className="w-full text-sm bg-gray-200 dark:bg-gray-700"
                                                >
                                                    Tidak Tersedia
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <DialogContent className="w-full max-w-lg md:max-w-xl overflow-y-auto max-h-[90vh]">
                                {selectedItem && (
                                    <>
                                        <DialogHeader className="pb-4">
                                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                                {selectedItem.nama_barang}
                                            </DialogTitle>
                                            <DialogDescription className="text-gray-500 dark:text-gray-400">
                                                {getCategoryName(
                                                    selectedItem.id_kategori
                                                )}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
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
                                                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                        selectedItem.status ===
                                                        "Tersedia"
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                    }`}
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    {selectedItem.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto">
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                Deskripsi
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line mb-4">
                                                {selectedItem.deskripsi ||
                                                    "Tidak ada deskripsi"}
                                            </p>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                        Stok Tersedia
                                                    </p>
                                                    <p className="text-lg font-bold">
                                                        {selectedItem.jumlah}{" "}
                                                        unit
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                        Periode Sewa
                                                    </p>
                                                    <p className="text-lg font-bold">
                                                        Harian
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {selectedItem.status === "Tersedia" && (
                                            <a
                                                href={getWhatsAppLink(
                                                    selectedItem
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1"
                                            >
                                                <Button className="w-full">
                                                    <Phone className="w-4 h-4 mr-2" />
                                                    Pesan Sekarang
                                                </Button>
                                            </a>
                                        )}
                                    </>
                                )}
                            </DialogContent>
                        </Dialog>

                        {/* Pagination - Updated to work with client-side filtering */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex flex-col items-center justify-between gap-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Menampilkan {startIndex + 1} -{" "}
                                    {Math.min(endIndex, totalFilteredItems)}{" "}
                                    dari {totalFilteredItems} peralatan
                                </div>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() =>
                                                    currentPage > 1 &&
                                                    handlePageChange(
                                                        currentPage - 1
                                                    )
                                                }
                                                className={
                                                    currentPage <= 1
                                                        ? "pointer-events-none opacity-50"
                                                        : "cursor-pointer"
                                                }
                                            />
                                        </PaginationItem>

                                        {getPageNumbers().map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() =>
                                                        handlePageChange(page)
                                                    }
                                                    isActive={
                                                        page === currentPage
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() =>
                                                    currentPage < totalPages &&
                                                    handlePageChange(
                                                        currentPage + 1
                                                    )
                                                }
                                                className={
                                                    currentPage >= totalPages
                                                        ? "pointer-events-none opacity-50"
                                                        : "cursor-pointer"
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
