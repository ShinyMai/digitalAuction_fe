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
    <>
      <div className={`flex gap-5 ${className}`}>
        <img
          src={`https://qr.sepay.vn/img?acc=67808082002&bank=TPBank&amount=${amount}&des=TKPDA ${userName} ${citizenIdentification} ${message} ${description}`}
          className="w-[40vh] h-[40vh] rounded-lg border border-gray-300"
        />
        <div className="flex flex-col justify-center items-start">
          <div className="text-2xl font-bold mb-4">
            Sử dụng dịch vụ quét QR của ngân hàng để thanh
            toán
          </div>
          <div className="text-xl font-semibold mb-2">
            Ngân hàng: TPBank
          </div>
          <div className="text-xl font-semibold mb-2">
            Số tài khoản: 67808082002
          </div>
          <div className="text-xl font-semibold mb-2">
            Số tiền:
            <span className="font-bold text-green-500">
              {amount} VND
            </span>
          </div>
          <div className="text-xl font-semibold mb-2">
            Nội dung: TKPDA {userName}
            {citizenIdentification} {message} {description}
          </div>
        </div>
      </div>
      <div className="text-base text-gray-600 text-center mt-4">
        * Lưu ý: Sử dụng camera điện thoại để quét mã QR và
        thực hiện thanh toán qua ứng dụng ngân hàng
      </div>
    </>
  );
};

export default SepayComponent;
