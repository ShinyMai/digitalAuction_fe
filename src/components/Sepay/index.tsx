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
          src={`https://qr.sepay.vn/img?acc=24059992699&bank=Agribank&amount=5000000&des=Chuyen%20tien%20dat%20coc%20DH8180c21b-72cf-4f06-96ac-931b0fa3ee4b&template=compact&download=false`}
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
            Nội dung: TKPDA {userName}{" "}
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
