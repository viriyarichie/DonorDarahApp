export interface User {
  id: number;
  nik: string;
  name: string;
  email: string;
  phone?: string;
  birth_date?: string;
  blood_type?: "A" | "B" | "AB" | "O";
  role: "pendonor" | "petugas" | "admin";
  total_donor?: number;
  created_at?: string;
}

export interface Location {
  id: number;
  name: string;
  type: "unit_tetap" | "unit_mobile" | "rumah_sakit";
  type_label: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface Stock {
  id: number;
  blood_type: "A" | "B" | "AB" | "O";
  amount: number;
  status: string;
  status_color: string;
  location?: {
    id: number;
    name: string;
    address: string;
    type: string;
  };
  updated_at?: string;
}

export interface StockSummary {
  [key: string]: {
    total: number;
    status: "aman" | "perlu_perhatian" | "kritis";
  };
}

export interface Booking {
  id: number;
  booking_date: string;
  booking_date_formatted?: string;
  status: "menunggu" | "dikonfirmasi" | "selesai" | "dibatalkan";
  notes?: string;
  user?: User;
  location?: {
    id: number;
    name: string;
    address: string;
    type: string;
  };
  donor?: Donor;
  created_at?: string;
}

export interface Donor {
  id: number;
  donation_date: string;
  donation_date_formatted?: string;
  donation_status: "berhasil" | "gagal" | "ditunda";
  user?: User;
  condition?: Condition;
  created_at?: string;
}

export interface Condition {
  id: number;
  hemoglobin: number;
  blood_pressure: string;
  eligibility_status: "layak" | "tidak_layak" | "ditunda";
  eligibility_label?: string;
  notes?: string;
  created_at?: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  event_date: string;
  event_date_formatted?: string;
  quota: number;
  registered_count: number;
  location?: Location;
  creator?: {
    id: number;
    name: string;
  };
  created_at?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  image_path?: string;
  published_at?: string;
  is_published: boolean;
  author?: {
    id: number;
    name: string;
  };
  created_at?: string;
}

export interface Certificate {
  id: number;
  milestone: number;
  status: "pending" | "disetujui" | "ditolak";
  issue_date?: string;
  file_url?: string;
  can_download: boolean;
  user?: User;
  created_at?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "reminder" | "penghargaan" | "event" | "umum";
  is_read: boolean;
  created_at?: string;
  created_at_diff?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface DashboardData {
  // Admin/Petugas
  stats?: {
    total_donors: number;
    total_users: number;
    total_bookings: number;
  };
  // Pendonor
  total_donor?: number;
  last_donation_date?: string;
  next_eligible_date?: string;
  next_milestone?: number;
  progress_to_next?: number;
  active_booking?: {
    id: number;
    date: string;
    location: string;
    status: string;
  };
  stock_summary?: StockSummary;
  upcoming_events?: Array<{
    id: number;
    name: string;
    date: string;
    location: string;
  }>;
  recent_donors?: Array<{
    name: string;
    blood_type: string;
    date: string;
  }>;
  donor_activity?: Array<{
    label: string;
    count: number;
  }>;
}
