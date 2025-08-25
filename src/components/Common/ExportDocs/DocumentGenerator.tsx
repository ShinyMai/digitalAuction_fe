import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import type { RegistrationAuctionModals } from "../../../pages/Anonymous/Modals";

export const getValueOrDots = (value: string | number | undefined): string => {
  if (value === undefined || value === "" || value === null) {
    return "..................................................";
  }
  return typeof value === "number" ? value.toLocaleString("vi-VN") : value;
};

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
                left: 1440,
                right: 1440,
                top: 1440,
                bottom: 1440,
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

export const exportToPdf = async (
  data?: Partial<RegistrationAuctionModals>
) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Phiếu Đăng Ký Đấu Giá</title>
          <style>
            @page { 
              size: A4; 
              margin: 20mm;
            }
            body {
              font-family: 'Times New Roman', serif;
              font-size: 14px;
              line-height: 1.6;
              color: black;
              background: white;
              margin: 0;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              font-size: 16px;
              font-weight: bold;
              margin: 5px 0;
            }
            .header .separator {
              border-top: 3px solid black;
              width: 200px;
              margin: 20px auto;
            }
            .title {
              text-align: center;
              margin-bottom: 30px;
            }
            .title h1 {
              font-size: 18px;
              font-weight: bold;
              margin: 0;
            }
            .title p {
              font-style: italic;
              margin: 10px 0;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 15px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            td {
              padding: 8px 0;
              vertical-align: top;
            }
            .label {
              width: 200px;
            }
            .value {
              border-bottom: 1px dotted black;
              min-height: 20px;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
            }
            .signature-box {
              text-align: center;
              width: 45%;
            }
            .signature-space {
              height: 80px;
              margin: 20px 0;
            }
            .date-section {
              text-align: center;
              margin-top: 30px;
              font-style: italic;
            }
            .commitment {
              text-align: justify;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
            <h1>Độc lập - Tự do - Hạnh phúc</h1>
            <div class="separator"></div>
          </div>

          <div class="title">
            <h1>PHIẾU ĐĂNG KÝ THAM GIA ĐẤU GIÁ</h1>
            <p>Kính gửi: Tổ chức bán đấu giá tài sản</p>
          </div>

          <div class="section">
            <div class="section-title">I. THÔNG TIN NGƯỜI ĐĂNG KÝ:</div>
            <table>
              <tr>
                <td class="label">1. Họ và tên:</td>
                <td class="value">${getValueOrDots(data?.fullName)}</td>
              </tr>
              <tr>
                <td class="label">2. Ngày sinh:</td>
                <td class="value">${getValueOrDots(
                  data?.dob ? dayjs(data.dob).format("DD/MM/YYYY") : ""
                )}</td>
              </tr>
              <tr>
                <td class="label">3. CCCD/CMND số:</td>
                <td class="value">${getValueOrDots(data?.idNumber)}</td>
              </tr>
              <tr>
                <td class="label">4. Ngày cấp:</td>
                <td class="value">${getValueOrDots(
                  data?.idDate ? dayjs(data.idDate).format("DD/MM/YYYY") : ""
                )}</td>
              </tr>
              <tr>
                <td class="label">5. Nơi cấp:</td>
                <td class="value">${getValueOrDots(data?.place)}</td>
              </tr>
              <tr>
                <td class="label">6. Địa chỉ thường trú:</td>
                <td class="value">${getValueOrDots(data?.address)}</td>
              </tr>
              <tr>
                <td class="label">7. Số điện thoại:</td>
                <td class="value">${getValueOrDots(data?.phone)}</td>
              </tr>
              <tr>
                <td class="label">8. Email:</td>
                <td class="value">.................................................</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">II. THÔNG TIN TÀI SẢN ĐĂNG KÝ ĐẤU GIÁ:</div>
            <table>
              <tr>
                <td class="label">1. Tên tài sản:</td>
                <td class="value">${getValueOrDots(data?.assetsInfo)}</td>
              </tr>
              <tr>
                <td class="label">2. Giá khởi điểm:</td>
                <td class="value">${getValueOrDots(
                  data?.priceStart
                    ? Number(data.priceStart).toLocaleString("vi-VN") + " VND"
                    : ""
                )}</td>
              </tr>
              <tr>
                <td class="label">3. Số tiền đặt cọc:</td>
                <td class="value">.................................................</td>
              </tr>
              <tr>
                <td class="label">4. Phí tham gia:</td>
                <td class="value">.................................................</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">III. CAM KẾT:</div>
            <div class="commitment">
              Tôi cam kết thực hiện đúng các quy định của pháp luật về đấu giá tài sản và quy chế đấu giá của tổ chức bán đấu giá.
              Nếu trúng đấu giá, tôi sẽ thực hiện đầy đủ các nghĩa vụ theo quy định.
            </div>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div><strong>TỔ CHỨC BÁN ĐẤU GIÁ</strong></div>
              <div style="font-style: italic;">(Ký tên, đóng dấu)</div>
              <div class="signature-space"></div>
            </div>
            <div class="signature-box">
              <div><strong>NGƯỜI ĐĂNG KÝ</strong></div>
              <div style="font-style: italic;">(Ký, ghi rõ họ tên)</div>
              <div class="signature-space"></div>
              <div>${getValueOrDots(data?.fullName)}</div>
            </div>
          </div>

          <div class="date-section">
            Ngày ${new Date().getDate()} tháng ${
      new Date().getMonth() + 1
    } năm ${new Date().getFullYear()}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Phieu_Dang_Ky_Dau_Gia_${getValueOrDots(
      data?.fullName
    ).replace(/\./g, "")}_${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(
      "Đã tải xuống file HTML! Mở file và in ra PDF từ trình duyệt.",
      {
        autoClose: 5000,
      }
    );
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    toast.error("Xuất file PDF thất bại!");
  }
};
