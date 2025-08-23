import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
    ChevronRightIcon,
    CheckCircle,
    ShieldCheck,
    Clock,
    Phone,
    Menu,
    X,
    Calendar,
    Image,
    ArrowRight,
    Instagram,
    Facebook,
    MapPin,
    Mail,
    Send,
    Package,
    UserIcon,
    Star,
    Shield,
    Users,
    Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HomePageProps {
    items: Item[];
    categories: Category[];
    isAuthenticated?: boolean;
}

export default function HomePage({
    items,
    categories,
    isAuthenticated = false,
}: HomePageProps) {
    const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formSubject, setFormSubject] = useState("");
    const [formMessage, setFormMessage] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const testimonials = [
        {
            name: "Raiaji Pribadi",
            role: "Client",
            content: "Support quality event equipment at friendly prices",
            avatar: "/api/placeholder/64/64",
            rating: 5,
        },
        {
            name: "Edi Mambo",
            role: "Client",
            content:
                "Dore's crew are friendly, kind, diligent and neat, the sound quality is also great, I hope Dore continues to progress with success",
            avatar: "/api/placeholder/64/64",
            rating: 5,
        },
        {
            name: "Yunia Dian",
            role: "Singer",
            content: "The best solution for rent sounds system in Bali",
            avatar: "/api/placeholder/64/64",
            rating: 5,
        },
    ];

    const recentProjects = [
        {
            title: "Festival Film Jakarta",
            image: "/api/placeholder/400/320",
            description:
                "Penyediaan pencahayaan untuk panggung utama dan area ekshibisi",
        },
        {
            title: "Konser Musik Nasional",
            image: "/api/placeholder/400/320",
            description:
                "Sistem pencahayaan lengkap untuk konser indoor dengan 5000 penonton",
        },
        {
            title: "Pemotretan Majalah Mode",
            image: "/api/placeholder/400/320",
            description:
                "Setup pencahayaan studio dan lokasi untuk brand fashion terkemuka",
        },
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsHeaderSticky(true);
            } else {
                setIsHeaderSticky(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const available = items.filter((item) => item.status === "Tersedia");
        setFeaturedItems(available.slice(0, 6));
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [items]);

    const getWhatsAppLink = (item: Item) => {
        const message = `Halo Dore Production, saya tertarik untuk menyewa *${item.nama_barang}*. Mohon informasi lebih lanjut.`;
        return `https://wa.me/089522734461?text=${encodeURIComponent(message)}`;
    };

    const getCategorySlug = (categoryId: string | number) => {
        const category = categories.find((c) => c.id === Number(categoryId));
        if (!category) return "default";
        return category.nama_kategori
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
            <Head title="Dore Production - Sewa Peralatan Pencahayaan Profesional" />
            <header
                className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 ${
                    isHeaderSticky
                        ? "sticky top-0 z-50 shadow-lg transition-all duration-300"
                        : ""
                }`}
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
                    <nav className="hidden md:flex space-x-6">
                        {[
                            "peralatan",
                            "tentang",
                            "proyek",
                            "testimonial",
                            "kontak",
                        ].map((section) => (
                            <a
                                key={section}
                                href={`#${section}`}
                                className="hover:text-red-700 dark:hover:text-red-600 transition-colors text-sm font-medium"
                            >
                                {section.charAt(0).toUpperCase() +
                                    section.slice(1)}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-3">
                        <AppearanceDropdown />
                        {isAuthenticated ? (
                            <Link href="/dashboard">
                                <Button
                                    variant="default"
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
                        <a
                            href="https://wa.me/089522734461"
                            className="md:flex items-center hidden"
                        >
                            <Button
                                variant="default"
                                size="sm"
                                className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 hover:opacity-90 transition-opacity shadow-md"
                            >
                                <Phone className="w-4 h-4 mr-1" /> Hubungi Kami
                            </Button>
                        </a>
                        <button
                            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 px-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
                        <nav className="flex flex-col space-y-4">
                            {[
                                "peralatan",
                                "tentang",
                                "proyek",
                                "testimonial",
                                "kontak",
                            ].map((section) => (
                                <a
                                    key={section}
                                    href={`#${section}`}
                                    className="hover:text-red-700 dark:hover:text-red-600 transition-colors py-1 text-sm font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {section.charAt(0).toUpperCase() +
                                        section.slice(1)}
                                </a>
                            ))}
                            <a
                                href="https://wa.me/089522734461"
                                className="flex items-center py-1 text-sm font-medium text-gray-900 dark:text-gray-100 mt-2"
                            >
                                <Phone className="w-4 h-4 mr-2" /> Hubungi Kami
                            </a>
                        </nav>
                    </div>
                )}
            </header>

            <section className="relative py-16 md:py-20 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="max-w-xl flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                                GIVING A SOLUTION FOR YOUR EVENT
                            </h1>
                            <p className="text-lg mb-8 text-gray-200">
                                We are ready to provide you a Good Sound System
                                and Lighting with BEST quality and BEST price.
                                Feel free to contact us
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/peralatan">
                                    <Button
                                        variant="default"
                                        className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 text-base font-medium shadow-lg"
                                    >
                                        Lihat Peralatan{" "}
                                        <ChevronRightIcon className="ml-1 w-5 h-5" />
                                    </Button>
                                </Link>
                                <a href="https://wa.me/089522734461">
                                    <Button
                                        variant="outline"
                                        className="border-white text-white hover:bg-white/10 px-6 py-3 text-base font-medium"
                                    >
                                        <Phone className="w-5 h-5 mr-1" />{" "}
                                        Konsultasi
                                    </Button>
                                </a>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 relative">
                                <img
                                    src="/banner-video.webp"
                                    className="w-full h-full object-cover"
                                    alt="Banner"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                                    <Button className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 rounded-full w-16 h-16 flex items-center justify-center">
                                        <Play className="w-8 h-8 fill-white" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="peralatan" className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                                Peralatan Unggulan
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                Peralatan premium yang siap untuk disewa
                            </p>
                        </div>
                        <Link href="/peralatan">
                            <Button
                                variant="link"
                                className="text-gray-900 dark:text-gray-100 p-0 flex items-center text-base font-medium"
                            >
                                Lihat Semua{" "}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {featuredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group"
                                >
                                    <div
                                        className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden cursor-pointer"
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setIsOpen(true);
                                        }}
                                    >
                                        {item.image ? (
                                            <img
                                                src={`/storage/${item.image}`}
                                                alt={item.nama_barang}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                                                <img
                                                    src={`/placeholders/${getCategorySlug(
                                                        item.id_kategori
                                                    )}-placeholder.jpg`}
                                                    alt={item.nama_barang}
                                                    className="w-full h-full object-cover opacity-70"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <Badge
                                                className={`${
                                                    item.status === "Tersedia"
                                                        ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                                } font-medium py-1 px-3`}
                                            >
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                {item.status}
                                            </Badge>
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <Button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                Lihat Detail
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-red-700 dark:group-hover:text-red-600 transition-colors">
                                                {item.nama_barang}
                                            </h3>
                                        </div>
                                        {item.deskripsi && (
                                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                                {item.deskripsi}
                                            </p>
                                        )}
                                        <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center">
                                                <Package className="w-4 h-4 mr-1" />
                                                Stok: {item.jumlah}
                                            </span>
                                            <span className="flex items-center">
                                                <Shield className="w-4 h-4 mr-1" />
                                                Garansi
                                            </span>
                                        </div>
                                        <a
                                            href={getWhatsAppLink(item)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <Button className="w-full bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 hover:from-gray-800 hover:to-gray-600 dark:hover:from-gray-200 dark:hover:to-gray-400 text-white dark:text-gray-900 h-11 rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
                                                <Phone className="w-4 h-4 mr-2" />
                                                Pesan Sekarang
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <DialogContent className="w-full max-w-2xl overflow-y-auto rounded-2xl">
                            {selectedItem && (
                                <>
                                    <DialogHeader className="pb-4">
                                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {selectedItem.nama_barang}
                                        </DialogTitle>
                                        <DialogDescription className="text-gray-500 dark:text-gray-400">
                                            Informasi lengkap peralatan
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-gray-100 dark:bg-gray-700">
                                        {selectedItem.image ? (
                                            <img
                                                src={`/storage/${selectedItem.image}`}
                                                alt={selectedItem.nama_barang}
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
                                            <Badge className="bg-green-600 text-white px-3 py-1">
                                                {selectedItem.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto mb-6">
                                        <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-3">
                                            Deskripsi
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                            {selectedItem.deskripsi ||
                                                "Tidak ada deskripsi tersedia."}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                                            <p className="text-sm text-gray-500 mb-2">
                                                Stok Tersedia
                                            </p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                {selectedItem.jumlah} unit
                                            </p>
                                        </div>
                                        {/* <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                                            <p className="text-sm text-gray-500 mb-2">
                                                Periode Sewa
                                            </p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                Harian/Mingguan/Bulanan
                                            </p>
                                        </div> */}
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <a
                                            href={getWhatsAppLink(selectedItem)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1"
                                        >
                                            <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-12 rounded-xl text-base font-medium shadow-md hover:shadow-lg transition-all">
                                                <Phone className="w-5 h-5 mr-2" />
                                                Pesan via WhatsApp
                                            </Button>
                                        </a>
                                    </div>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                            Layanan Kami
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            Solusi lengkap untuk kebutuhan pencahayaan produksi
                            Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                            <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-12 h-12 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                Sewa Fleksibel
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Pilihan sewa harian, mingguan, atau bulanan
                                sesuai kebutuhan.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                                    <span>Periode sewa yang fleksibel</span>
                                </li>
                                <li className="flex items-start text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                                    <span>
                                        Diskon untuk sewa jangka panjang
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-12 h-12 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                Peralatan Premium
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Peralatan pencahayaan berkualitas tinggi dari
                                brand terkemuka.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                                    <span>Peralatan selalu terawat</span>
                                </li>
                                <li className="flex items-start text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                                    <span>Standar kualitas industri</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                            <div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl w-12 h-12 flex items-center justify-center">
                                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                Dukungan Teknis
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Tim ahli kami siap membantu dengan konsultasi
                                atau bantuan teknis.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                                    <span>Konsultasi pra-produksi</span>
                                </li>
                                <li className="flex items-start text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                                    <span>Bantuan teknis selama proyek</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Projects */}
            <section id="proyek" className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                            Post Terbaru
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            Beberapa proyek yang telah kami dukung dengan solusi
                            pencahayaan
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Instagram */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    Instagram
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Dapatkan informasi terkini tentang proyek
                                    dan layanan kami
                                </p>
                            </div>
                            <div className="aspect-square w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-md">
                                <iframe
                                    src="https://www.instagram.com/doreproduction/embed"
                                    className="w-full h-full"
                                    frameBorder="0"
                                    scrolling="no"
                                    allow="encrypted-media"
                                />
                            </div>
                        </div>

                        {/* Facebook */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    Facebook
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Ikuti kami di Facebook untuk update acara
                                    dan dokumentasi terbaru
                                </p>
                            </div>
                            <div className="aspect-square w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-md">
                                <iframe
                                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FDorepro&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                                    width="100%"
                                    height="100%"
                                    style={{
                                        border: "none",
                                        overflow: "hidden",
                                    }}
                                    scrolling="no"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="rounded-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About */}
            <section id="tentang" className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                                Tentang Dore Production
                            </h2>
                            <p className="mb-4 text-gray-600 dark:text-gray-300">
                                Dore Production adalah usaha yang bergerak di
                                bidang penyewaan Sound and Lighting untuk event
                                atau acara yang memerlukannya, Dore Production
                                juga menyediakan jasa mengorganisir acara atau
                                event organizer
                            </p>
                            <p className="mb-6 text-gray-600 dark:text-gray-300">
                                Dengan pengalaman lebih dari 10 tahun, kami
                                memahami kebutuhan pencahayaan yang unik dari
                                berbagai jenis produksi dan berkomitmen untuk
                                memberikan solusi terbaik.
                            </p>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                            Peralatan Standar Industri
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Menyediakan peralatan pencahayaan
                                            terkini dari brand terpercaya
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                            Dukungan Teknis Tersedia
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Tim teknisi berpengalaman siap
                                            membantu selama proses produksi
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <a href="https://wa.me/089522734461">
                                <Button className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 hover:opacity-90 transition-opacity px-6 py-3 text-base">
                                    <Phone className="w-5 h-5 mr-2" /> Hubungi
                                    Tim Kami
                                </Button>
                            </a>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src="/banner-video.webp"
                                    className="w-full h-full object-cover"
                                    alt="Banner"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section
                id="testimonial"
                className="py-16 bg-white dark:bg-gray-900"
            >
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                            Apa Kata Klien Kami
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            Pendapat dari berbagai klien yang telah menggunakan
                            jasa kami
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {testimonials.map((testimonial, idx) => (
                                <div
                                    key={idx}
                                    className={`transition-all duration-500 ${
                                        idx === activeTestimonial
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-95 absolute top-0 left-0 right-0"
                                    }`}
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-center mb-4">
                                            {renderStars(testimonial.rating)}
                                        </div>
                                        <p className="text-lg italic mb-6 text-gray-600 dark:text-gray-300 text-center">
                                            "{testimonial.content}"
                                        </p>
                                        <div className="flex items-center justify-center">
                                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-4">
                                                <UserIcon className="w-6 h-6 text-gray-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    {testimonial.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-8">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTestimonial(idx)}
                                    className={`w-3 h-3 rounded-full mx-2 transition-colors ${
                                        idx === activeTestimonial
                                            ? "bg-gray-900 dark:bg-gray-100"
                                            : "bg-gray-300 dark:bg-gray-700"
                                    }`}
                                    aria-label={`View testimonial ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="kontak" className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                                Hubungi Kami
                            </h2>
                            <p className="mb-8 text-gray-600 dark:text-gray-300">
                                Punya pertanyaan atau ingin memesan? Jangan ragu
                                untuk menghubungi kami.
                            </p>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block mb-2 font-medium"
                                        >
                                            Nama
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formName}
                                            onChange={(e) =>
                                                setFormName(e.target.value)
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700"
                                            placeholder="Nama Lengkap"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 font-medium"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formEmail}
                                            onChange={(e) =>
                                                setFormEmail(e.target.value)
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="block mb-2 font-medium"
                                    >
                                        Subjek
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={formSubject}
                                        onChange={(e) =>
                                            setFormSubject(e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700"
                                        placeholder="Subjek pesan"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block mb-2 font-medium"
                                    >
                                        Pesan
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        value={formMessage}
                                        onChange={(e) =>
                                            setFormMessage(e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700"
                                        placeholder="Tulis pesan Anda di sini..."
                                    ></textarea>
                                </div>

                                <a
                                    href={`https://wa.me/6289522734461?text=${encodeURIComponent(
                                        `Halo Dore Production!\nNama: ${formName}\nEmail: ${formEmail}\nSubjek: ${formSubject}\nPesan: ${formMessage}`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button
                                        type="button"
                                        className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 hover:opacity-90 transition-opacity w-full py-3 text-base font-medium"
                                    >
                                        <Send className="w-5 h-5 mr-2" /> Kirim
                                        via WhatsApp
                                    </Button>
                                </a>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2">
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 h-full">
                                <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                                    Informasi Kontak
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl mr-4">
                                            <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-lg text-gray-900 dark:text-gray-100 mb-1">
                                                Alamat
                                            </h4>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Jalan Sedap Malam Gg Rampai 1b
                                                no 22,
                                                <br />
                                                Denpasar, Indonesia, Bali
                                            </p>
                                        </div>
                                    </div>
                                    <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!4v1690960183730!6m8!1m7!1sAF1QipPo3cM96v6pkZgLuinpfAy7d-ZGz92hdj5_y1aa!2m2!1d-8.6599141!2d115.2508148!3f75!4f0!5f0.7820865974627469"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            className="rounded-2xl"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl mr-4">
                                            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-lg text-gray-900 dark:text-gray-100 mb-1">
                                                Email
                                            </h4>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                info@doreproduction.id
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl mr-4">
                                            <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-lg text-gray-900 dark:text-gray-100 mb-1">
                                                Telepon / Phone
                                            </h4>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                +62 819-1640-2006
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl mr-4">
                                            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-lg text-gray-900 dark:text-gray-100 mb-1">
                                                Jam Operasional
                                            </h4>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Senin - Sabtu: 08:00 - 21:00
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold mb-4 mt-8 text-gray-900 dark:text-gray-100">
                                    Ikuti Kami
                                </h3>
                                <div className="flex space-x-4">
                                    <a
                                        href="https://www.instagram.com/doreproduction/"
                                        className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Instagram className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                                    </a>
                                    <a
                                        href="https://www.facebook.com/Dorepro/"
                                        className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Facebook className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-to-b from-gray-900 to-gray-950 dark:from-gray-950 dark:to-black py-12 text-gray-300 dark:text-gray-400 border-t border-gray-800 dark:border-gray-900">
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
                                        href="#tentang"
                                        className="hover:text-white transition-colors flex items-center"
                                    >
                                        <ArrowRight className="w-3 h-3 mr-2" />{" "}
                                        Tentang Kami
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#proyek"
                                        className="hover:text-white transition-colors flex items-center"
                                    >
                                        <ArrowRight className="w-3 h-3 mr-2" />{" "}
                                        Proyek
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#testimonial"
                                        className="hover:text-white transition-colors flex items-center"
                                    >
                                        <ArrowRight className="w-3 h-3 mr-2" />{" "}
                                        Testimonial
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#kontak"
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
