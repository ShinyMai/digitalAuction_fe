interface InfoRowProps {
  label: string;
  value: string | number | React.ReactNode;
  isTag?: boolean;
  color?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, color }) => {
  return (
    <div className="flex flex-row gap-24 items-start">
      <span className="w-28 font-medium text-gray-600">{label}</span>
      <strong
        className="max-w-[330px] font-semibold text-gray-800"
        style={{ color }}
      >
        {value}
      </strong>
    </div>
  );
};
