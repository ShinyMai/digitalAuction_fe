import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import type { RegistrationAuctionModals } from "../../../pages/Anonymous/Modals";

// Utility function to replace empty values with dots
export const getValueOrDots = (value: string | number | undefined): string => {
  if (value === undefined || value === "" || value === null) {
    return "..................................................";
  }
  return typeof value === "number" ? value.toLocaleString("vi-VN") : value;
};

// Document generation function
export const exportToDocx = async (
  data?: Partial<RegistrationAuctionModals>
) => {
  try {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                left: 1440, // 2.54 cm (1440 twips)
                right: 1440, // 2.54 cm
                top: 1440, // 2.54 cm
                bottom: 1440, // 2.54 cm
              },
            },
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                  bold: true,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 300, after: 0 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Độc lập - Tự do - Hạnh phúc",
                  bold: true,
                  size: 24,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "PHIẾU ĐĂNG KÝ THAM GIA ĐẤU GIÁ",
                  bold: true,
                  size: 36,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 300, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Kính gửi: Công ty hợp danh đấu giá tài sản Tuấn Linh",
                  italics: true,
                  size: 28,
                  font: "Times New Roman",
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Địa chỉ: số nhà 29, ngõ 40, đường Lê Thái Tổ, phố Tân Thịnh, phường Tân Thành, TP Hoa Lư, tỉnh Ninh Bình.",
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Tên tôi là: ",
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `${getValueOrDots(data?.fullName)}`,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: { firstLine: 720 },
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Ngày, tháng, năm sinh: ",
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `${getValueOrDots(
                    dayjs(data?.dob).format("DD/MM/YYYY")
                  )}`,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: { firstLine: 720 },
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "CCCD số: ",
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `${getValueOrDots(data?.idNumber)}`,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: { firstLine: 720 },
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Ngày cấp: ",
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `${getValueOrDots(
                    dayjs(data?.idDate).format("DD/MM/YYYY")
                  )}`,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: { firstLine: 720 },
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Nơi cấp: ",
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `${getValueOrDots(data?.place)}`,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: { firstLine: 720 },
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "  Số điện thoại: ",
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `${getValueOrDots(data?.phone)}`,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: { firstLine: 720 },
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Địa chỉ thường trú: ",
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `${getValueOrDots(data?.address)}`,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: { firstLine: 720 },
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Sau khi nghiên cứu hồ sơ, quy chế và tham khảo tài sản đấu giá là ",
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `${getValueOrDots(data?.auctionInfo)}.`,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 100 },
              indent: { firstLine: 720 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Nay tôi đăng ký với Công ty hợp danh đấu giá tài sản Tuấn Linh để được mua hồ sơ và tham gia đấu giá quyền sử dụng : ",
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `${getValueOrDots(data?.assetsInfo)}`,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 100 },
              indent: { firstLine: 720 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Giá khởi điểm của tài sản là: ",
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `${getValueOrDots(data?.priceStart)}`,
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: " đồng/m2.",
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: { firstLine: 720 },
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Nếu không trúng đấu giá và không thuộc các trường hợp không được nhận lại tiền đặt trước tôi đăng ký nhận lại tiền đặt trước vào Tài khoản (Trường hợp khách hàng nhận bằng tiền mặt phần này bỏ trống):",
                  italics: true,
                  size: 28,
                  font: "Times New Roman",
                  bold: true,
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 100 },
              indent: { firstLine: 720 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Chủ tài khoản: ",
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `${getValueOrDots(data?.bankAccount)}`,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: { firstLine: 720 },
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Số tài khoản: ",
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `${getValueOrDots(data?.bankAccountNumber)}`,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: { firstLine: 720 },
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Mở tại ngân hàng: ",
                  size: 28,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `${getValueOrDots(data?.bankBranch)}`,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: { firstLine: 720 },
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "(Tiền phí chuyển khoản phải nộp do người nhận thanh toán)",
                  italics: true,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: { firstLine: 720 },
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Tôi xin cam kết:",
                  bold: true,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.LEFT,
              indent: { firstLine: 720 },
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "1. Chấp nhận tham gia đấu giá tài sản với mức giá khởi điểm mà Công ty đã thông báo.",
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 100 },
              indent: { firstLine: 720 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "2. Khi tham gia đấu giá tài sản, tôi cam kết thực hiện đúng nội quy, quy chế đấu giá của công ty, không thuộc trường hợp không được tham gia đấu giá. Nếu trúng đấu giá, tôi xin cam kết sử dụng đất đúng mục đích, đúng quy hoạch và các quy định khác của pháp luật. Tôi xin chịu hoàn toàn trách nhiệm trước công ty theo quy định của pháp luật nếu có sai phạm.",
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 200 },
              indent: { firstLine: 720 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Ninh Bình, ",
                  size: 28,
                  italics: true,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: `ngày ${dayjs().format("DD")}, tháng ${dayjs().format(
                    "MM"
                  )}, năm ${dayjs().format("YYYY")}`,
                  size: 28,
                  font: "Times New Roman",
                  italics: true,
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "NGƯỜI ĐĂNG KÝ THAM GIA ĐẤU GIÁ TÀI SẢN",
                  bold: true,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "(Ký và ghi họ, tên)",
                  italics: true,
                  bold: true,
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(
      blob,
      `Phieu_Dang_Ky_Dau_Gia_${getValueOrDots(data?.fullName)}_${getValueOrDots(
        data?.assetsInfo
      )}_${new Date().toISOString().split("T")[0]}.docx`
    );
    toast.success("Xuất file Word thành công!");
  } catch (error) {
    console.error("Error exporting to Word:", error);
    toast.error("Xuất file Word thất bại!");
  }
};
