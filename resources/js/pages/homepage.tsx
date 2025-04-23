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

    useEffect(() => {
        const available = items.filter((item) => item.status === "Tersedia");
        setFeaturedItems(available.slice(0, 6));
    }, [items]);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Head title="DoRe Production - Sewa Peralatan Pencahayaan Profesional" />

            {/* Header */}
            <header className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">DoRe Production</h1>
                    <nav className="hidden md:flex space-x-8">
                        {["peralatan", "tentang", "kontak"].map((section) => (
                            <a
                                key={section}
                                href={`#${section}`}
                                className="hover:text-primary transition-colors"
                            >
                                {section.charAt(0).toUpperCase() +
                                    section.slice(1)}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-4">
                        <AppearanceDropdown />
                        {isAuthenticated && (
                            <Link href="/dashboard">
                                <Button variant="default">
                                    Admin Dashboard
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative h-[26rem] bg-gradient-to-r from-muted to-background text-white flex items-center">
                <div className="absolute inset-0 bg-black/50" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Sewa Peralatan Pencahayaan Profesional
                        </h1>
                        <p className="text-xl mb-6">
                            Peralatan pencahayaan berkualitas tinggi untuk
                            kebutuhan produksi Anda.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <Link href="#peralatan">
                                <Button variant="default">
                                    Lihat Peralatan
                                </Button>
                            </Link>
                            <Link href="#kontak">
                                <Button variant="outline">Hubungi Kami</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Equipment */}
            <section id="peralatan" className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        Peralatan Unggulan
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-card text-card-foreground rounded-lg shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
                            >
                                <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={`/storage/${item.image}`}
                                            alt={item.nama_barang}
                                            className="object-cover h-full w-full"
                                        />
                                    ) : (
                                        <span className="text-muted-foreground">
                                            Tidak ada gambar
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">
                                        {item.nama_barang}
                                    </h3>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-muted-foreground">
                                            Tersedia: {item.jumlah}
                                        </span>
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                            Tersedia
                                        </span>
                                    </div>
                                    <Link href="https://wa.me/089522734461">
                                        <Button className="w-full">
                                            Sewa Sekarang
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About */}
            <section id="tentang" className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-3xl font-bold mb-6">
                                Tentang DoRe Production
                            </h2>
                            <p className="mb-4 text-muted-foreground">
                                DoRe Production adalah penyedia layanan sewa
                                peralatan pencahayaan profesional untuk film,
                                televisi, fotografi, dan produksi acara di
                                Indonesia.
                            </p>
                            <p className="mb-4 text-muted-foreground">
                                Kami memahami kebutuhan pencahayaan yang unik
                                dari berbagai produksi dan menawarkan solusi
                                sesuai kebutuhan Anda.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                                    Peralatan standar industri
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                                    Sewa fleksibel
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                                    Dukungan teknis tersedia
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 bg-muted h-96 flex items-center justify-center rounded-lg">
                            <span className="text-muted-foreground">
                                Gambar
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section
                id="kontak"
                className="py-16 bg-muted text-muted-foreground"
            >
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
                        Hubungi Kami
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-foreground">
                                Kontak
                            </h3>
                            <p className="mb-4">
                                Butuh bantuan memilih peralatan atau memiliki
                                pertanyaan? Tim kami siap membantu.
                            </p>
                            <ul className="space-y-2">
                                <li>
                                    <strong>Alamat:</strong> Jl. Raya Production
                                    No. 123, Jakarta
                                </li>
                                <li>
                                    <strong>Telepon:</strong> +62 123 4567 890
                                </li>
                                <li>
                                    <strong>Email:</strong>{" "}
                                    info@doreproduction.com
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-foreground">
                                Jam Operasional
                            </h3>
                            <ul className="space-y-2">
                                <li>Senin - Jumat: 08.00 - 18.00</li>
                                <li>Sabtu: 09.00 - 16.00</li>
                                <li>Minggu: Tutup</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background border-t border-border py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                    &copy; {new Date().getFullYear()} DoRe Production. Semua hak
                    dilindungi.
                </div>
            </footer>
        </div>
    );
}
