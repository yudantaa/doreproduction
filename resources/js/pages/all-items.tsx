// resources/js/Pages/all-items.tsx

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
    Calendar,
    Image,
    Instagram,
    Facebook,
    Twitter,
    Eye,
    Package,
    Search,
    Filter,
    Mail,
    MapPin,
} from "lucide-react";

interface AllItemsPageProps {
    items: Item[];
    categories: Category[];
    isAuthenticated?: boolean;
}

export default function AllItemsPage({
    items,
    categories,
    isAuthenticated = false,
}: AllItemsPageProps) {
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);

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
    }, [items, searchTerm, selectedCategory, statusFilter]);

    const getWhatsAppLink = (item: Item) =>
        `https://wa.me/089522734461?text=${encodeURIComponent(
            `Halo saya mau sewa ${item.nama_barang}`
        )}`;

    const getCategoryName = (categoryId: number) =>
        categories.find((c) => c.id === categoryId)?.nama_kategori || "-";

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All");
        setStatusFilter("All");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Head title="Semua Peralatan - Dore Production" />

            {/* === Header === */}
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

            {/* === Filters === */}
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

                {/* === Items Grid === */}
                {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">
                            Tidak ada peralatan ditemukan
                        </h3>
                    </div>
                ) : (
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm hover:shadow-md group overflow-hidden"
                                >
                                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
                                        {item.image ? (
                                            <img
                                                src={`/storage/${item.image}`}
                                                alt={item.nama_barang}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <Image className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                        <span
                                            className={`absolute top-2 left-2 px-2 py-1 text-xs rounded-full ${
                                                item.status === "Tersedia"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            <CheckCircle className="w-3 h-3 mr-1 inline" />{" "}
                                            {item.status}
                                        </span>
                                        <DialogTrigger asChild>
                                            <button
                                                className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setIsOpen(true);
                                                }}
                                            >
                                                <p className="font-bold">
                                                    Lihat Detail
                                                </p>
                                            </button>
                                        </DialogTrigger>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold mb-1">
                                            {item.nama_barang}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-2">
                                            {getCategoryName(item.id_kategori)}
                                        </p>
                                        <p className="text-xs mb-2 text-gray-500">
                                            Stok: {item.jumlah}
                                        </p>
                                        {item.status === "Tersedia" ? (
                                            <a
                                                href={getWhatsAppLink(item)}
                                                target="_blank"
                                            >
                                                <Button className="w-full text-sm">
                                                    <Phone className="w-4 h-4 mr-1" />{" "}
                                                    Pesan Sekarang
                                                </Button>
                                            </a>
                                        ) : (
                                            <Button
                                                disabled
                                                className="w-full text-sm bg-gray-300"
                                            >
                                                Tidak Tersedia
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* === Modal === */}
                        <DialogContent className="w-full max-w-lg md:max-w-xl  overflow-y-auto">
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

                                    {/* Gambar */}
                                    {selectedItem.image && (
                                        <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                                            <img
                                                src={`/storage/${selectedItem.image}`}
                                                alt={selectedItem.nama_barang}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                        selectedItem.status ===
                                                        "Tersedia"
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                    }`}
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-1" />{" "}
                                                    {selectedItem.status}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Deskripsi scrollable */}
                                    <div className="overflow-y-auto max-h-40 mb-4">
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            Deskripsi
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                            {selectedItem.deskripsi}
                                        </p>
                                    </div>

                                    {/* Specs */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">
                                                Stok Tersedia
                                            </p>
                                            <p className="text-lg font-bold">
                                                {selectedItem.jumlah} unit
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">
                                                Periode Sewa
                                            </p>
                                            <p className="text-lg font-bold">
                                                Harian
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tombol CTA */}
                                    {selectedItem.status === "Tersedia" && (
                                        <a
                                            href={getWhatsAppLink(selectedItem)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1"
                                        >
                                            <Button className="w-full mt-4">
                                                <Phone className="w-4 h-4 mr-2" />{" "}
                                                Pesan Sekarang
                                            </Button>
                                        </a>
                                    )}
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
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
