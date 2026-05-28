import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, Activity, Droplets, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import donorService from '../../services/donorService';
import { PageSkeleton } from '../../components/ui/LoadingSkeleton';

export const KondisiDarahPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['kondisi-terbaru'],
    queryFn: () => donorService.getLatestCondition(),
  });

  if (isLoading) return <PageSkeleton />;

  if (isError || !data?.data?.data) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Kondisi Darah</h1>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-gray-400" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum Ada Data Kondisi</h3>
          <p className="text-sm text-gray-500">Kondisi darah Anda akan tersedia setelah proses donor selesai dilakukan.</p>
        </div>
      </div>
    );
  }

  const condition = data.data.data;
  const eligColor = condition.eligibility_status === 'layak'
    ? 'green' : condition.eligibility_status === 'ditunda' ? 'amber' : 'red';
  const EligIcon = condition.eligibility_status === 'layak'
    ? CheckCircle : condition.eligibility_status === 'ditunda' ? AlertCircle : XCircle;

  const hbNormal = condition.hemoglobin >= 12.5;
  const bpParts = condition.blood_pressure.split('/');
  const bpSys = parseInt(bpParts[0] || '0');
  const bpDia = parseInt(bpParts[1] || '0');
  const bpNormal = bpSys >= 100 && bpSys <= 160 && bpDia >= 70 && bpDia <= 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kondisi Darah</h1>
        <p className="text-sm text-gray-500 mt-1">Hasil pemeriksaan donor terakhir Anda</p>
      </div>

      {/* Eligibility Status */}
      <div className={`rounded-2xl p-6 border-2 ${
        eligColor === 'green'
          ? 'bg-green-50 border-green-200'
          : eligColor === 'amber'
          ? 'bg-amber-50 border-amber-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-4">
          <EligIcon
            size={40}
            className={eligColor === 'green' ? 'text-green-600' : eligColor === 'amber' ? 'text-amber-600' : 'text-red-600'}
          />
          <div>
            <div className="text-lg font-bold text-gray-900">{condition.eligibility_label}</div>
            <div className={`text-sm font-medium ${
              eligColor === 'green' ? 'text-green-700' : eligColor === 'amber' ? 'text-amber-700' : 'text-red-700'
            }`}>
              Status kelayakan donor darah
            </div>
            <div className="text-xs text-gray-500 mt-1">Pemeriksaan: {condition.created_at}</div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Droplets className="text-red-600" size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700">Hemoglobin</div>
              <div className="text-xs text-gray-400">Normal: ≥ 12.5 g/dL</div>
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900">{condition.hemoglobin}</div>
          <div className="text-sm text-gray-500 mt-1">g/dL</div>
          <div className={`mt-3 text-xs font-medium px-3 py-1.5 rounded-full inline-block ${
            hbNormal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {hbNormal ? 'Normal' : 'Di bawah normal'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700">Tekanan Darah</div>
              <div className="text-xs text-gray-400">Normal: 100-160/70-100</div>
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900">{condition.blood_pressure}</div>
          <div className="text-sm text-gray-500 mt-1">mmHg</div>
          <div className={`mt-3 text-xs font-medium px-3 py-1.5 rounded-full inline-block ${
            bpNormal ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {bpNormal ? 'Normal' : 'Perlu diperhatikan'}
          </div>
        </div>
      </div>

      {/* Notes */}
      {condition.notes && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">Catatan PMI</h3>
          <p className="text-sm text-gray-600">{condition.notes}</p>
        </div>
      )}
    </div>
  );
};
