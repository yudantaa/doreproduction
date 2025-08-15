export interface BrokenItemReport {
    id: string;
    item_id: string;
    reporter_id: string;
    description: string;
    proof_image_path: string | null;
    status: 'reported' | 'in_repair' | 'repaired' | 'rejected';
    repair_notes: string | null;
    repair_requester_id: string | null;
    repair_requested_at: string | null;
    created_at: string;
    updated_at: string;
    item: {
        id: string;
        nama_barang: string;
        image?: string | null;
    };
    reporter: {
        id: string;
        name: string;
    };
    repairRequester?: {
        id: string;
        name: string;
    } | null;
}
