// Add this to your types file (e.g., @/types/broken-item.ts)

export interface BrokenItemReport {
    id: number;
    id_item_unit: number;
    id_pelapor: number;
    description: string;
    proof_image_path?: string;
    status: 'reported' | 'in_repair' | 'repaired' | 'rejected';
    repair_requested_at?: string;
    repair_notes?: string;
    created_at: string;
    updated_at: string;

    // Relationships
    itemUnit: {
        id: number;
        id_barang: number;
        kode_unit: string;
        status: string;
        item: {
            id: number;
            nama_barang: string;
            image?: string;
        };
    };

    reporter: {
        id: number;
        name: string;
        email: string;
    };

    repairRequester?: {
        id: number;
        name: string;
        email: string;
    };

    // For backward compatibility (computed in backend)
    item: {
        id: number;
        nama_barang: string;
        image?: string;
    };
}
