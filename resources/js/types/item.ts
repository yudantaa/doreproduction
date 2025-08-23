export interface Item {
  id: string;
  nama_barang: string;
  deskripsi: string;
  id_kategori: string;
  image?: string | null;
  total_unit: number;
  available_unit: number;
  created_at: string;
  category?: {
    id: string;
    nama_kategori: string;
  };
}
