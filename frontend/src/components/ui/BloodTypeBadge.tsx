interface BloodTypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

const colors: Record<string, string> = {
  A: 'bg-blue-100 text-blue-700 border-blue-200',
  B: 'bg-green-100 text-green-700 border-green-200',
  AB: 'bg-purple-100 text-purple-700 border-purple-200',
  O: 'bg-amber-100 text-amber-700 border-amber-200',
};

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-4 py-1.5 font-bold',
};

export const BloodTypeBadge = ({ type, size = 'md' }: BloodTypeBadgeProps) => (
  <span className={`inline-flex items-center rounded-full border font-semibold ${colors[type] || 'bg-gray-100 text-gray-700'} ${sizes[size]}`}>
    {type}
  </span>
);
