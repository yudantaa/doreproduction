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
                "DoRe Production memberikan solusi pencahayaan yang sempurna untuk acara korporat kami. Tim yang sangat membantu!",
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

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Head title="DoRe Production - Sewa Peralatan Pencahayaan Profesional" />

            {/* Header */}
            <header
                className={`bg-background border-b border-border ${
                    isHeaderSticky
                        ? "sticky top-0 z-50 shadow-md transition-all duration-300"
                        : ""
                }`}
            >
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-2">
                                <span className="text-white font-bold">DR</span>
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                DoRe Production
                            </h1>
                        </div>
                    </Link>

                    <nav className="hidden md:flex space-x-8">
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
                                className="hover:text-primary transition-colors font-medium relative group"
                            >
                                {section.charAt(0).toUpperCase() +
                                    section.slice(1)}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <AppearanceDropdown />
                        {isAuthenticated ? (
                            <Link href="/dashboard">
                                <Button variant="default">
                                    Admin Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="https://wa.me/089522734461">
                                <Button
                                    variant="default"
                                    className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
                                >
                                    <Phone className="w-4 h-4 mr-2" /> Hubungi
                                    Kami
                                </Button>
                            </Link>
                        )}
                        <button
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 px-4 bg-background border-t border-border">
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
                                    className="hover:text-primary transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {section.charAt(0).toUpperCase() +
                                        section.slice(1)}
                                </a>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative h-[32rem] bg-gradient-to-r from-blue-900 to-purple-900 flex items-center overflow-hidden">
                {/* Background animation dots */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6bTAtOGMwIDEgMSAyIDIgMnMyLTEgMi0yLTEtMi0yLTItMiAxLTIgMnptLTE4IDBjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6bTkgOGMwIDEgMSAyIDIgMnMyLTEgMi0yLTEtMi0yLTItMiAxLTIgMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl">
                        <div className="mb-4 inline-block">
                            <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium">
                                Profesional & Terpercaya
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                            Solusi Pencahayaan{" "}
                            <span className="text-primary">Profesional</span>{" "}
                            untuk Produksi Anda
                        </h1>
                        <p className="text-xl mb-8 text-white/80">
                            Peralatan pencahayaan berkualitas tinggi untuk film,
                            fotografi, dan event dengan dukungan teknis dari tim
                            ahli.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <Link href="#peralatan">
                                <Button
                                    variant="default"
                                    className="bg-primary hover:bg-primary/90 text-white font-medium py-6 px-8 rounded-xl"
                                >
                                    Lihat Peralatan{" "}
                                    <ChevronRightIcon className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="#kontak">
                                <Button
                                    variant="outline"
                                    className="border-white text-white hover:bg-white/10 py-6 px-8 rounded-xl"
                                >
                                    Konsultasi Gratis
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute right-0 -bottom-32 w-64 h-64 bg-primary/30 rounded-full blur-3xl"></div>
                <div className="absolute -right-20 top-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>
            </section>

            {/* Stats Section */}
            <section className="py-8 bg-background relative z-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-16">
                        <div className="bg-card shadow-lg rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                            <div className="text-3xl font-bold text-primary mb-1">
                                500+
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Peralatan Premium
                            </div>
                        </div>
                        <div className="bg-card shadow-lg rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                            <div className="text-3xl font-bold text-primary mb-1">
                                1200+
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Proyek Selesai
                            </div>
                        </div>
                        <div className="bg-card shadow-lg rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                            <div className="text-3xl font-bold text-primary mb-1">
                                98%
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Klien Puas
                            </div>
                        </div>
                        <div className="bg-card shadow-lg rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                            <div className="text-3xl font-bold text-primary mb-1">
                                10
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Tahun Pengalaman
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Kategori Peralatan
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Kami menyediakan berbagai peralatan pencahayaan
                            untuk memenuhi kebutuhan produksi Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.slice(0, 4).map((category, index) => (
                            <div
                                key={category.id || index}
                                className="bg-card shadow-md rounded-xl p-6 text-center hover:shadow-lg transition-all border border-transparent hover:border-primary/20"
                            >
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Image className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {category.nama_kategori ||
                                        `Kategori ${index + 1}`}
                                </h3>
                                <Link href={`/kategori/${category.id}`}>
                                    <Button
                                        variant="outline"
                                        className="rounded-lg w-full"
                                    >
                                        Lihat Semua
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Equipment */}
            <section id="peralatan" className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                Peralatan Unggulan
                            </h2>
                            <p className="text-muted-foreground">
                                Peralatan premium yang siap untuk disewa
                            </p>
                        </div>
                        <Link href="/peralatan">
                            <Button
                                variant="link"
                                className="flex items-center"
                            >
                                Lihat Semua Peralatan{" "}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-card text-card-foreground rounded-xl shadow-md hover:shadow-xl transition-all border border-border group overflow-hidden"
                            >
                                <div className="h-48 bg-muted flex items-center justify-center overflow-hidden relative">
                                    {item.image ? (
                                        <img
                                            src={`/storage/${item.image}`}
                                            alt={item.nama_barang}
                                            className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="bg-gradient-to-br from-muted to-muted-foreground/10 h-full w-full flex items-center justify-center">
                                            <Image className="w-12 h-12 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-medium">
                                            Tersedia
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold">
                                            {item.nama_barang}
                                        </h3>
                                        <span className="flex items-center text-amber-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="ml-1 text-sm">
                                                4.9
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-muted-foreground">
                                            Stok tersedia:{" "}
                                            <span className="font-medium">
                                                {item.jumlah}
                                            </span>
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4 inline mr-1" />{" "}
                                            Harian
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary font-bold">
                                            "Hubungi kami"
                                        </span>
                                        <Link href={`/peralatan/${item.id}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full"
                                            >
                                                Detail
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="px-6 pb-6">
                                    <Link href="https://wa.me/089522734461">
                                        <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 rounded-lg">
                                            Sewa Sekarang
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 bg-gradient-to-b from-background to-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Layanan Kami
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Solusi lengkap untuk kebutuhan pencahayaan produksi
                            Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all border border-border">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Sewa Fleksibel
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Pilihan sewa harian, mingguan, atau bulanan
                                sesuai dengan kebutuhan produksi Anda.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                    <span className="text-sm">
                                        Periode sewa yang fleksibel
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                    <span className="text-sm">
                                        Diskon untuk sewa jangka panjang
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                    <span className="text-sm">
                                        Perpanjangan mudah
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all border border-border">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Peralatan Premium
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Peralatan pencahayaan berkualitas tinggi dari
                                brand terkemuka di industri.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                    <span className="text-sm">
                                        Peralatan selalu terawat
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                    <span className="text-sm">
                                        Standar kualitas industri
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                    <span className="text-sm">
                                        Update peralatan terbaru
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all border border-border">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Phone className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Dukungan Teknis
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Tim ahli kami siap membantu dengan konsultasi
                                atau bantuan teknis.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                    <span className="text-sm">
                                        Konsultasi pra-produksi
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                    <span className="text-sm">
                                        Bantuan teknis selama proyek
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                    <span className="text-sm">
                                        Dukungan 24/7 untuk klien
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Projects */}
            <section id="proyek" className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Proyek Terbaru
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Beberapa proyek terbaru yang telah kami dukung
                            dengan solusi pencahayaan
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recentProjects.map((project, index) => (
                            <div key={index} className="group">
                                <div className="overflow-hidden rounded-xl mb-4 aspect-video relative">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <div className="text-white">
                                            <h3 className="font-bold text-lg">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-white/80">
                                                {project.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {project.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About */}
            <section id="tentang" className="py-16 bg-muted">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/2">
                            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                                Tentang Kami
                            </span>
                            <h2 className="text-3xl font-bold mb-6">
                                DoRe Production - Ahli Solusi Pencahayaan
                            </h2>
                            <p className="mb-4 text-muted-foreground">
                                DoRe Production adalah penyedia layanan sewa
                                peralatan pencahayaan profesional terkemuka
                                untuk film, televisi, fotografi, dan produksi
                                acara di Indonesia.
                            </p>
                            <p className="mb-6 text-muted-foreground">
                                Dengan pengalaman lebih dari 10 tahun, kami
                                memahami kebutuhan pencahayaan yang unik dari
                                berbagai jenis produksi dan berkomitmen untuk
                                memberikan solusi terbaik sesuai kebutuhan Anda.
                            </p>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start">
                                    <div className="bg-primary/10 p-2 rounded-lg mr-4">
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">
                                            Peralatan Standar Industri
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Menyediakan peralatan pencahayaan
                                            terkini dari brand terpercaya
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-primary/10 p-2 rounded-lg mr-4">
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">
                                            Sewa Fleksibel
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Pilihan periode sewa yang dapat
                                            disesuaikan dengan jadwal produksi
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-primary/10 p-2 rounded-lg mr-4">
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">
                                            Dukungan Teknis Tersedia
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Tim teknisi berpengalaman siap
                                            membantu selama proses produksi
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Link href="#kontak">
                                <Button className="bg-primary hover:bg-primary/90">
                                    Hubungi Tim Kami{" "}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="w-full lg:w-1/2 bg-white p-2 rounded-xl shadow-xl">
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                                <img
                                    src="/api/placeholder/800/450"
                                    alt="DoRe Production Team"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-primary/80 rounded-full p-4 cursor-pointer hover:bg-primary transition-colors">
                                        {/* <Play
                                            className="w-8 h-8 text-white"
                                            fill="white"
                                        /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonial" className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Apa Kata Klien Kami
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
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
                                    <div className="bg-card rounded-xl shadow-lg p-8 md:p-10 relative">
                                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary text-white rounded-full p-3">
                                            <Star
                                                className="w-6 h-6"
                                                fill="white"
                                            />
                                        </div>
                                        <p className="text-lg md:text-xl italic mb-8 text-center">
                                            "{testimonial.content}"
                                        </p>
                                        <div className="flex items-center justify-center">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="w-12 h-12 rounded-full border-2 border-primary"
                                            />
                                            <div className="ml-4">
                                                <h4 className="font-bold">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
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
                                    className={`w-3 h-3 rounded-full mx-1 transition-all ${
                                        idx === activeTestimonial
                                            ? "bg-primary scale-125"
                                            : "bg-muted-foreground/30"
                                    }`}
                                    aria-label={`View testimonial ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-primary to-purple-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="mb-8 md:mb-0">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                Siap untuk meningkatkan kualitas produksi Anda?
                            </h2>
                            <p className="text-white/80">
                                Konsultasikan kebutuhan pencahayaan untuk proyek
                                Anda dengan tim ahli kami
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="#kontak">
                                <Button className="bg-white text-primary hover:bg-white/90 px-6 py-6 rounded-xl">
                                    Hubungi Kami
                                </Button>
                            </Link>
                            <Link href="/peralatan">
                                <Button
                                    variant="outline"
                                    className="border-white text-white hover:bg-white/10 px-6 py-6 rounded-xl"
                                >
                                    Lihat Peralatan
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="kontak" className="py-16 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Hubungi Kami
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Tim kami siap membantu menjawab semua pertanyaan
                            Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-card p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Alamat
                            </h3>
                            <p className="text-muted-foreground">
                                Jl. Raya Production No. 123
                                <br />
                                Jakarta Selatan, 12345
                            </p>
                        </div>

                        <div className="bg-card p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Telepon
                            </h3>
                            <p className="text-muted-foreground mb-2">
                                +62 123 4567 890
                            </p>
                            <p className="text-muted-foreground">
                                +62 895 2273 4461
                            </p>
                        </div>

                        <div className="bg-card p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Email
                            </h3>
                            <p className="text-muted-foreground">
                                info@doreproduction.com
                            </p>
                            <p className="text-muted-foreground">
                                rental@doreproduction.com
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-card p-8 rounded-xl shadow-md">
                            <h3 className="text-xl font-semibold mb-6">
                                Kirim Pesan
                            </h3>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium mb-1"
                                        >
                                            Nama
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Nama Anda"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium mb-1"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="email@anda.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Subjek
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Subjek pesan"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        Pesan
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Tulis pesan Anda di sini..."
                                    ></textarea>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                                >
                                    <Send className="w-4 h-4 mr-2" /> Kirim
                                    Pesan
                                </Button>
                            </form>
                        </div>

                        <div>
                            <div className="bg-card p-8 rounded-xl shadow-md mb-8">
                                <h3 className="text-xl font-semibold mb-4">
                                    Jam Operasional
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex justify-between pb-2 border-b border-border">
                                        <span>Senin - Jumat</span>
                                        <span className="font-medium">
                                            08.00 - 18.00
                                        </span>
                                    </li>
                                    <li className="flex justify-between pb-2 border-b border-border">
                                        <span>Sabtu</span>
                                        <span className="font-medium">
                                            09.00 - 16.00
                                        </span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Minggu</span>
                                        <span className="font-medium">
                                            Tutup
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-card p-8 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold mb-4">
                                    Ikuti Kami
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Dapatkan update terbaru dari kami melalui
                                    media sosial
                                </p>
                                <div className="flex space-x-4">
                                    <a
                                        href="#"
                                        className="bg-muted w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                    >
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="#"
                                        className="bg-muted w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                    >
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="#"
                                        className="bg-muted w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                    >
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t border-border py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-2">
                                    <span className="text-white font-bold">
                                        DR
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                    DoRe Production
                                </h2>
                            </div>
                            <p className="text-muted-foreground mb-4">
                                Solusi pencahayaan profesional untuk kebutuhan
                                produksi film, fotografi, dan event di
                                Indonesia.
                            </p>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-4">
                                Kategori
                            </h3>
                            <ul className="space-y-2">
                                {[
                                    "Lighting",
                                    "Audio",
                                    "Kamera",
                                    "Aksesoris",
                                ].map((category) => (
                                    <li key={category}>
                                        <a
                                            href="#"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {category}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-4">
                                Tautan
                            </h3>
                            <ul className="space-y-2">
                                {[
                                    "Tentang Kami",
                                    "Layanan",
                                    "Proyek",
                                    "FAQ",
                                    "Kebijakan Privasi",
                                ].map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-4">
                                Newsletter
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Dapatkan info terbaru dan penawaran khusus dari
                                kami
                            </p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Email Anda"
                                    className="rounded-l-lg border border-border bg-background px-4 py-2 focus:outline-none flex-grow"
                                />
                                <Button className="rounded-l-none bg-primary hover:bg-primary/90">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center">
                        <div className="text-muted-foreground text-sm mb-4 md:mb-0">
                            &copy; {new Date().getFullYear()} DoRe Production.
                            Semua hak dilindungi.
                        </div>
                        <div className="flex space-x-4 text-sm text-muted-foreground">
                            <a
                                href="#"
                                className="hover:text-primary transition-colors"
                            >
                                Syarat & Ketentuan
                            </a>
                            <a
                                href="#"
                                className="hover:text-primary transition-colors"
                            >
                                Kebijakan Privasi
                            </a>
                            <a
                                href="#"
                                className="hover:text-primary transition-colors"
                            >
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
