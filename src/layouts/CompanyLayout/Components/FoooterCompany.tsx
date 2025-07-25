import { assets } from "../../../assets";

const FooterCompany = () => {
    return (
        <div className="min-h-20 bg-stone-300/30  flex flex-col
    md:flex-row gap-4 md:gap-18 items-center justify-around text-center md:text-left">
            <img
                src={assets.logo}
                className="w-20 md:w-36 rounded-2xl mb-4 md:mb-0"
                alt="Logo"
            />
            <div className="text-sm md:text-base">
                <div className="font-bold text-lg md:text-xl mb-2">
                    CÔNG TY HỢP DANH ĐẤU GIÁ TÀI SẢN SỐ VDA
                </div>
                <div>
                    Địa chỉ: Đại học FPT Hà Nội, Khu công nghệ cao Hòa
                    Lạc, Thạch Thất, Hà Nội
                </div>
                <div>Điện thoại: 0876126324</div>
                <div>Email: digitalAuction@gmail.com</div>
                <div>Giấy đăng ký hoạt động số: .....</div>
            </div>
        </div>
    );
};

export default FooterCompany;
