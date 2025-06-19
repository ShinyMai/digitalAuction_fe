interface SepayProps {
  amount?: string;
  description?: string;
  userName?: string;
  citizenIdentification?: string;
  isDeposit?: boolean;
  className?: string;
}

const SepayComponent = ({
  amount,
  description,
  userName,
  citizenIdentification,
  isDeposit,
  className,
}: SepayProps) => {
  const message = isDeposit
    ? "dat truoc"
    : "chuyen tien mua ho so";
  return (
    <div className={className}>
      <img
        src={`https://qr.sepay.vn/img?acc=67808082002&bank=TPBank&amount=${amount}&des=TKPDA ${userName} ${citizenIdentification} ${message} ${description}`}
      />
    </div>
  );
};

export default SepayComponent;
