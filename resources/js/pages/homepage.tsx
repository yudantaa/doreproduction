import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Item } from "./item/columns";
import { Category } from "./category/columns";
import AppearanceDropdown from "@/components/appearance-dropdown";
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
    Star,
    ArrowRight,
    Instagram,
    Facebook,
    Twitter,
    MapPin,
    Mail,
    Send,
} from "lucide-react";

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

    // Testimonials data
    const testimonials = [
        {
            name: "Budi Santoso",
            role: "Film Director",
            content:
                "Kualitas peralatan terbaik dan layanan yang sangat profesional. Selalu menjadi pilihan utama untuk semua proyek saya.",
            avatar: "/api/placeholder/64/64",
        },
        {
            name: "Rina Wijaya",
            role: "Event Organizer",
            content:
                "Dore Production memberikan solusi pencahayaan yang sempurna untuk acara korporat kami. Tim yang sangat membantu!",
            avatar: "/api/placeholder/64/64",
        },
        {
            name: "Ahmad Fadli",
            role: "Photography Studio Owner",
            content:
                "Sangat puas dengan layanan dan kualitas peralatan. Hubungan kerja yang lancar dan profesional.",
            avatar: "/api/placeholder/64/64",
        },
    ];

    // Recent projects
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

    // Handle sticky header
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

        // Auto-rotate testimonials
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [items]);

    const getWhatsAppLink = (item: Item) => {
        const message = `Halo Dore Production, saya tertarik untuk menyewa ${item.nama_barang}. Mohon informasi lebih lanjut.`;
        return `https://wa.me/089522734461?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
            <Head title="Dore Production - Sewa Peralatan Pencahayaan Profesional" />

            {/* Header */}
            <header
                className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${
                    isHeaderSticky
                        ? "sticky top-0 z-50 shadow-sm transition-all duration-300"
                        : ""
                }`}
            >
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center mr-2">
                                <span className="text-white dark:text-gray-900 font-bold text-sm">
                                    DR
                                </span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Dore Production
                            </h1>
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
                                className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm font-medium"
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
                                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 dark:border-gray-600"
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
                                className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                            >
                                <Phone className="w-4 h-4 mr-1" /> Hubungi Kami
                            </Button>
                        </a>
                        <button
                            className="md:hidden"
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

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-3 px-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <nav className="flex flex-col space-y-3">
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
                                    className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-1 text-sm"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {section.charAt(0).toUpperCase() +
                                        section.slice(1)}
                                </a>
                            ))}
                            <a
                                href="https://wa.me/089522734461"
                                className="flex items-center py-1 text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                                <Phone className="w-4 h-4 mr-2" /> Hubungi Kami
                            </a>
                        </nav>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative py-12 bg-gray-100 dark:bg-gray-800 flex items-center overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-xl">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100 leading-tight">
                            Solusi Pencahayaan Profesional untuk Produksi Anda
                        </h1>
                        <p className="text-base mb-6 text-gray-600 dark:text-gray-300">
                            Peralatan pencahayaan berkualitas tinggi untuk film,
                            fotografi, dan event dengan dukungan teknis dari tim
                            ahli.
                        </p>
                        <div className="flex gap-3">
                            <Link href="#peralatan">
                                <Button
                                    variant="default"
                                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                                >
                                    Lihat Peralatan{" "}
                                    <ChevronRightIcon className="ml-1 w-4 h-4" />
                                </Button>
                            </Link>
                            <a href="https://wa.me/089522734461">
                                <Button
                                    variant="outline"
                                    className="border-gray-300 dark:border-gray-600"
                                >
                                    <Phone className="w-4 h-4 mr-1" />{" "}
                                    Konsultasi
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-8 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 shadow-sm rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                500+
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Peralatan Premium
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 shadow-sm rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                1200+
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Proyek Selesai
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 shadow-sm rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                98%
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Klien Puas
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 shadow-sm rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                10
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Tahun Pengalaman
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Equipment */}
            <section
                id="peralatan"
                className="py-10 bg-gray-50 dark:bg-gray-900"
            >
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">
                                Peralatan Unggulan
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Peralatan premium yang siap untuk disewa
                            </p>
                        </div>
                        <Link href="/peralatan">
                            <Button
                                variant="link"
                                className="text-gray-900 dark:text-gray-100 p-0 flex items-center"
                            >
                                Lihat Semua{" "}
                                <ArrowRight className="ml-1 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden relative">
                                    {item.image ? (
                                        <img
                                            src={`/storage/${item.image}`}
                                            alt={item.nama_barang}
                                            className="object-cover h-full w-full"
                                        />
                                    ) : (
                                        <div className="bg-gray-300 dark:bg-gray-600 h-full w-full flex items-center justify-center">
                                            <Image className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                                            Tersedia
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                            {item.nama_barang}
                                        </h3>
                                    </div>
                                    <div className="flex justify-between items-center mb-3 text-xs text-gray-500 dark:text-gray-400">
                                        <span>Stok: {item.jumlah}</span>
                                        <span>
                                            <Calendar className="w-3 h-3 inline mr-1" />{" "}
                                            Harian
                                        </span>
                                    </div>
                                    <a
                                        href={getWhatsAppLink(item)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button className="w-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 text-sm h-8">
                                            <Phone className="w-3 h-3 mr-1" />{" "}
                                            Pesan Sekarang
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-10 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">
                            Layanan Kami
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Solusi lengkap untuk kebutuhan pencahayaan produksi
                            Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="mb-3">
                                <Calendar className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                                Sewa Fleksibel
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                Pilihan sewa harian, mingguan, atau bulanan
                                sesuai kebutuhan.
                            </p>
                            <ul className="space-y-1">
                                <li className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-gray-900 dark:text-gray-100 mr-2 shrink-0 mt-0.5" />
                                    <span>Periode sewa yang fleksibel</span>
                                </li>
                                <li className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-gray-900 dark:text-gray-100 mr-2 shrink-0 mt-0.5" />
                                    <span>
                                        Diskon untuk sewa jangka panjang
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="mb-3">
                                <ShieldCheck className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                                Peralatan Premium
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                Peralatan pencahayaan berkualitas tinggi dari
                                brand terkemuka.
                            </p>
                            <ul className="space-y-1">
                                <li className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-gray-900 dark:text-gray-100 mr-2 shrink-0 mt-0.5" />
                                    <span>Peralatan selalu terawat</span>
                                </li>
                                <li className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-gray-900 dark:text-gray-100 mr-2 shrink-0 mt-0.5" />
                                    <span>Standar kualitas industri</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="mb-3">
                                <Phone className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                                Dukungan Teknis
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                Tim ahli kami siap membantu dengan konsultasi
                                atau bantuan teknis.
                            </p>
                            <ul className="space-y-1">
                                <li className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-gray-900 dark:text-gray-100 mr-2 shrink-0 mt-0.5" />
                                    <span>Konsultasi pra-produksi</span>
                                </li>
                                <li className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-gray-900 dark:text-gray-100 mr-2 shrink-0 mt-0.5" />
                                    <span>Bantuan teknis selama proyek</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Projects */}
            <section id="proyek" className="py-10 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">
                            Proyek Terbaru
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Beberapa proyek yang telah kami dukung dengan solusi
                            pencahayaan
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recentProjects.map((project, index) => (
                            <div key={index}>
                                <div className="overflow-hidden rounded-lg mb-2 aspect-video">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="font-medium text-base text-gray-900 dark:text-gray-100">
                                    {project.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {project.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About */}
            <section id="tentang" className="py-10 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-start gap-8">
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                                Tentang Dore Production
                            </h2>
                            <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                                Dore Production adalah penyedia layanan sewa
                                peralatan pencahayaan profesional terkemuka
                                untuk film, televisi, fotografi, dan produksi
                                acara di Indonesia.
                            </p>
                            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                                Dengan pengalaman lebih dari 10 tahun, kami
                                memahami kebutuhan pencahayaan yang unik dari
                                berbagai jenis produksi dan berkomitmen untuk
                                memberikan solusi terbaik.
                            </p>
                            <div className="space-y-3 mb-4">
                                <div className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-gray-900 dark:text-gray-100 mr-2 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                            Peralatan Standar Industri
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Menyediakan peralatan pencahayaan
                                            terkini dari brand terpercaya
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-gray-900 dark:text-gray-100 mr-2 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                            Dukungan Teknis Tersedia
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Tim teknisi berpengalaman siap
                                            membantu selama proses produksi
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <a href="https://wa.me/089522734461">
                                <Button className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200">
                                    <Phone className="w-4 h-4 mr-1" /> Hubungi
                                    Tim Kami
                                </Button>
                            </a>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                <img
                                    src="/api/placeholder/800/450"
                                    alt="Dore Production Team"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section
                id="testimonial"
                className="py-10 bg-gray-50 dark:bg-gray-900"
            >
                <div className="container mx-auto px-4">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">
                            Apa Kata Klien Kami
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Pendapat dari berbagai klien yang telah menggunakan
                            jasa kami
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
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
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                        <p className="text-base italic mb-4 text-gray-600 dark:text-gray-300 text-center">
                                            "{testimonial.content}"
                                        </p>
                                        <div className="flex items-center justify-center">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div className="ml-3">
                                                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {testimonial.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-4">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTestimonial(idx)}
                                    className={`w-2 h-2 rounded-full mx-1 transition-colors ${
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
            <section id="kontak" className="py-10 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                                Hubungi Kami
                            </h2>
                            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                                Punya pertanyaan atau ingin memesan? Jangan ragu
                                untuk menghubungi kami.
                            </p>

                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block mb-1 text-sm text-gray-900 dark:text-gray-100"
                                        >
                                            Nama
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                            placeholder="Nama Lengkap"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block mb-1 text-sm text-gray-900 dark:text-gray-100"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="block mb-1 text-sm text-gray-900 dark:text-gray-100"
                                    >
                                        Subjek
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                        placeholder="Subjek pesan"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block mb-1 text-sm text-gray-900 dark:text-gray-100"
                                    >
                                        Pesan
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                        placeholder="Tulis pesan Anda di sini..."
                                    ></textarea>
                                </div>
                                <Button
                                    type="submit"
                                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                                >
                                    <Send className="w-4 h-4 mr-1" /> Kirim
                                    Pesan
                                </Button>
                            </form>
                        </div>

                        <div className="w-full lg:w-1/2">
                            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                    Informasi Kontak
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <MapPin className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-3 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                Alamat
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Jl. Tebet Raya No. 123, Jakarta
                                                Selatan
                                                <br />
                                                DKI Jakarta, 12840
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Mail className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-3 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                Email
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                info@doreproduction.id
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Phone className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-3 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                Telepon / Phone
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                +62 895-2273-4461
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Clock className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-3 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                Jam Operasional
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Senin - Jumat: 09:00 - 17:00
                                                <br />
                                                Sabtu: 09:00 - 14:00
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold mb-3 mt-6 text-gray-900 dark:text-gray-100">
                                    Ikuti Kami
                                </h3>
                                <div className="flex space-x-3">
                                    <a
                                        href="#"
                                        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <Instagram className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                                    </a>
                                    <a
                                        href="#"
                                        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <Facebook className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                                    </a>
                                    <a
                                        href="#"
                                        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <Twitter className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 dark:bg-gray-950 py-8 text-gray-300 dark:text-gray-400 border-t border-gray-800 dark:border-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                                    <span className="text-gray-900 font-bold text-sm">
                                        DR
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    Dore Production
                                </h3>
                            </div>
                            <p className="text-sm mb-4">
                                Solusi pencahayaan profesional untuk produksi
                                film, fotografi, dan acara.
                            </p>
                            <div className="flex space-x-3">
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <Twitter className="w-5 h-5" />
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
                                            href={`/kategori/${category.nama_kategori}`}
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
                                        href="#tentang"
                                        className="hover:text-white transition-colors"
                                    >
                                        Tentang Kami
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#proyek"
                                        className="hover:text-white transition-colors"
                                    >
                                        Proyek
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#testimonial"
                                        className="hover:text-white transition-colors"
                                    >
                                        Testimonial
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#kontak"
                                        className="hover:text-white transition-colors"
                                    >
                                        Kontak
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        href="/syarat-ketentuan"
                                        className="hover:text-white transition-colors"
                                    >
                                        Syarat & Ketentuan
                                    </Link>
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
                                        Jl. Tebet Raya No. 123, Jakarta Selatan
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <Mail className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                                    <span>info@doreproduction.id</span>
                                </li>
                                <li className="flex items-start">
                                    <Phone className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                                    <span>+62 895-2273-4461</span>
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
