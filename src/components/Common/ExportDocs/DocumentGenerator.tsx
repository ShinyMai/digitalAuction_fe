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

// PDF export function
export const exportToPdf = async (
  data?: Partial<RegistrationAuctionModals>
) => {
  try {
    // Create a temporary div to hold our content
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: 794px;
      background: white;
      font-family: 'Times New Roman', serif;
      font-size: 14px;
      line-height: 1.5;
      padding: 40px;
      color: black;
    `;

    tempDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 16px; font-weight: bold; margin: 0;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
        <h2 style="font-size: 16px; font-weight: bold; margin: 10px 0;">Độc lập - Tự do - Hạnh phúc</h2>
        <div style="border-top: 3px solid black; width: 200px; margin: 20px auto;"></div>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 18px; font-weight: bold; margin: 0;">PHIẾU ĐĂNG KÝ THAM GIA ĐẤU GIÁ</h1>
        <p style="font-style: italic; margin: 10px 0;">Kính gửi: Tổ chức bán đấu giá tài sản</p>
      </div>

      <div style="margin-bottom: 20px;">
        <p><strong>I. THÔNG TIN NGƯỜI ĐĂNG KÝ:</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px 0; width: 200px;">1. Họ và tên:</td>
            <td style="padding: 8px 0; border-bottom: 1px dotted black;">${getValueOrDots(data?.fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">2. Ngày sinh:</td>
            <td style="padding: 8px 0; border-bottom: 1px dotted black;">${getValueOrDots(data?.dob ? dayjs(data.dob).format("DD/MM/YYYY") : "")}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">3. CCCD/CMND số:</td>
            <td style="padding: 8px 0; border-bottom: 1px dotted black;">${getValueOrDots(data?.idNumber)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">4. Ngày cấp:</td>
            <td style="padding: 8px 0; border-bottom: 1px dotted black;">${getValueOrDots(data?.idDate ? dayjs(data.idDate).format("DD/MM/YYYY") : "")}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">5. Nơi cấp:</td>
            <td style="padding: 8px 0; border-bottom: 1px dotted black;">${getValueOrDots(data?.place)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">6. Địa chỉ thường trú:</td>
            <td style="padding: 8px 0; border-bottom: 1px dotted black;">${getValueOrDots(data?.address)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">7. Số điện thoại:</td>
            <td style="padding: 8px 0; border-bottom: 1px dotted black;">${getValueOrDots(data?.phone)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">8. Email:</td>
            <td style="padding: 8px 0; border-bottom: 1px dotted black;">.................................................</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <p><strong>II. THÔNG TIN TÀI SẢN ĐĂNG KÝ ĐẤU GIÁ:</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px 0; width: 200px;">1. Tên tài sản:</td>
            <td style="padding: 8px 0; border-bottom: 1px dotted black;">${getValueOrDots(data?.assetsInfo)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">2. Giá khởi điểm:</td>
            <td style="padding: 8px 0; border-bottom: 1px dotted black;">${getValueOrDots(data?.priceStart ? Number(data.priceStart).toLocaleString("vi-VN") + " VND" : "")}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">3. Số tiền đặt cọc:</td>
            <td style="padding: 8px 0; border-bottom: 1px dotted black;">.................................................</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">4. Phí tham gia:</td>
            <td style="padding: 8px 0; border-bottom: 1px dotted black;">.................................................</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <p><strong>III. CAM KẾT:</strong></p>
        <p style="text-align: justify; margin-bottom: 10px;">
          Tôi cam kết thực hiện đúng các quy định của pháp luật về đấu giá tài sản và quy chế đấu giá của tổ chức bán đấu giá.
          Nếu trúng đấu giá, tôi sẽ thực hiện đầy đủ các nghĩa vụ theo quy định.
        </p>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div style="text-align: center;">
          <p><strong>TỔ CHỨC BÁN ĐẤU GIÁ</strong></p>
          <p style="font-style: italic;">(Ký tên, đóng dấu)</p>
          <div style="height: 80px;"></div>
        </div>
        <div style="text-align: center;">
          <p><strong>NGƯỜI ĐĂNG KÝ</strong></p>
          <p style="font-style: italic;">(Ký, ghi rõ họ tên)</p>
          <div style="height: 80px;"></div>
          <p>${getValueOrDots(data?.fullName)}</p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <p><em>Ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}</em></p>
      </div>
    `;

    document.body.appendChild(tempDiv);

    // Use browser's print functionality to generate PDF
    const printContent = tempDiv.innerHTML;
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Phiếu Đăng Ký Đấu Giá</title>
          <style>
            @media print {
              body { margin: 0; }
              @page { size: A4; margin: 20mm; }
            }
            body {
              font-family: 'Times New Roman', serif;
              font-size: 14px;
              line-height: 1.5;
              color: black;
              background: white;
            }
          </style>
        </head>
        <body>${printContent}</body>
        </html>
      `);

      printWindow.document.close();

      // Wait for content to load then trigger print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }

    // Clean up
    document.body.removeChild(tempDiv);
    toast.success("Đã mở cửa sổ in PDF. Vui lòng chọn 'Save as PDF' trong dialog in!");

  } catch (error) {
    console.error("Error exporting to PDF:", error);
    toast.error("Xuất file PDF thất bại!");
  }
};
