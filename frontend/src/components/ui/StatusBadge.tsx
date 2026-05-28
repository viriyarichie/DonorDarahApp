interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  menunggu: { label: 'Menunggu', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  dikonfirmasi: { label: 'Dikonfirmasi', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  selesai: { label: 'Selesai', className: 'bg-green-100 text-green-700 border-green-200' },
  dibatalkan: { label: 'Dibatalkan', className: 'bg-red-100 text-red-700 border-red-200' },
  berhasil: { label: 'Berhasil', className: 'bg-green-100 text-green-700 border-green-200' },
  gagal: { label: 'Gagal', className: 'bg-red-100 text-red-700 border-red-200' },
  ditunda: { label: 'Ditunda', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  pending: { label: 'Menunggu Review', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  disetujui: { label: 'Disetujui', className: 'bg-green-100 text-green-700 border-green-200' },
  ditolak: { label: 'Ditolak', className: 'bg-red-100 text-red-700 border-red-200' },
  layak: { label: 'Layak Donor', className: 'bg-green-100 text-green-700 border-green-200' },
  tidak_layak: { label: 'Tidak Layak', className: 'bg-red-100 text-red-700 border-red-200' },
  terdaftar: { label: 'Terdaftar', className: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-700 border-gray-200' };
  return (
    <span className={`inline-flex items-center rounded-full border text-xs font-semibold px-2.5 py-1 ${config.className}`}>
      {config.label}
    </span>
  );
};
