export interface ItemUnit {
  id: string;
  id_barang: string;
  kode_unit: string;
  status: 'Tersedia' | 'Rusak' | 'Dalam Perbaikan' | 'Disewa' | 'Tidak Tersedia';
  created_at: string;
  updated_at: string;
  item?: {
    id: string;
    nama_barang: string;
  };
}
