import { useState } from "react";
import {
  Card,
  Typography,
  Steps,
  Button,
  Row,
  Col,
  Collapse,
  Timeline,
  Space,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  FileTextOutlined,
  DollarOutlined,
  SafetyOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  BookOutlined,
  TrophyOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const Guidance = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeKey, setActiveKey] = useState(["1"]);

  const steps = [
    {
      title: "Đăng ký tài khoản",
      content: "Tạo tài khoản để tham gia đấu giá",
      icon: <UserOutlined />,
      description: "Đăng ký tài khoản với thông tin cá nhân chính xác",
    },
    {
      title: "Tìm kiếm đấu giá",
      content: "Khám phá các phiên đấu giá phù hợp",
      icon: <SearchOutlined />,
      description: "Tìm kiếm và lọc các phiên đấu giá theo nhu cầu",
    },
    {
      title: "Đăng ký tham gia",
      content: "Đăng ký và nộp tiền đặt cọc",
      icon: <FileTextOutlined />,
      description: "Hoàn tất thủ tục đăng ký và thanh toán phí",
    },
    {
      title: "Tham gia đấu giá",
      content: "Đưa ra mức giá của bạn",
      icon: <DollarOutlined />,
      description: "Tham gia đấu giá trong thời gian quy định",
    },
    {
      title: "Hoàn tất giao dịch",
      content: "Thanh toán và nhận tài sản",
      icon: <SafetyOutlined />,
      description: "Hoàn tất các thủ tục cuối cùng",
    },
  ];

  const features = [
    {
      icon: <TrophyOutlined className="text-blue-500 text-2xl" />,
      title: "Đấu giá minh bạch",
      description:
        "Hệ thống đấu giá công khai, minh bạch với quy trình được giám sát chặt chẽ",
    },
    {
      icon: <SafetyOutlined className="text-green-500 text-2xl" />,
      title: "Bảo mật tuyệt đối",
      description:
        "Thông tin cá nhân và giao dịch được bảo mật với công nghệ hiện đại",
    },
    {
      icon: <ClockCircleOutlined className="text-orange-500 text-2xl" />,
      title: "Thời gian thực",
      description:
        "Cập nhật giá đấu theo thời gian thực, không bỏ lỡ cơ hội nào",
    },
    {
      icon: <TeamOutlined className="text-purple-500 text-2xl" />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ chuyên viên hỗ trợ khách hàng 24/7 qua nhiều kênh",
    },
  ];

  const faqData = [
    {
      key: "1",
      label: "Làm thế nào để đăng ký tài khoản?",
      children: (
        <div>
          <Paragraph>Để đăng ký tài khoản, bạn cần:</Paragraph>
          <Timeline
            items={[
              {
                children: "Truy cập trang đăng ký",
              },
              {
                children: "Điền đầy đủ thông tin cá nhân",
              },
              {
                children: "Xác thực email và số điện thoại",
              },
              {
                children: "Hoàn tất quy trình xác minh danh tính",
              },
            ]}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Phí tham gia đấu giá là bao nhiêu?",
      children: (
        <div>
          <Paragraph>Phí tham gia đấu giá bao gồm:</Paragraph>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <Text strong>Phí đăng ký:</Text> 500.000 VNĐ - 2.000.000 VNĐ tùy
              loại tài sản
            </li>
            <li>
              <Text strong>Tiền đặt cọc:</Text> 10% - 20% giá khởi điểm
            </li>
            <li>
              <Text strong>Phí dịch vụ:</Text> 2% giá trúng đấu (nếu thành công)
            </li>
          </ul>
        </div>
      ),
    },
    {
      key: "3",
      label: "Thời gian đấu giá kéo dài bao lâu?",
      children: (
        <Paragraph>
          Thời gian đấu giá thường kéo dài từ 2-4 giờ tùy vào loại tài sản. Hệ
          thống sẽ tự động gia hạn thêm 5 phút nếu có người đưa ra giá mới trong
          2 phút cuối.
        </Paragraph>
      ),
    },
    {
      key: "4",
      label: "Điều gì xảy ra nếu tôi thắng đấu giá?",
      children: (
        <div>
          <Paragraph>Khi thắng đấu giá, bạn cần:</Paragraph>
          <Timeline
            items={[
              {
                children: "Thanh toán số tiền còn lại trong vòng 15 ngày",
              },
              {
                children: "Hoàn tất thủ tục pháp lý chuyển nhượng",
              },
              {
                children: "Nhận bàn giao tài sản",
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <Title
            level={1}
            className="!text-white !mb-4 font-bold text-4xl md:text-6xl"
          >
            <BookOutlined className="mr-4" />
            Hướng dẫn sử dụng
          </Title>
          <Text className="!text-white !text-xl !leading-relaxed block max-w-3xl mx-auto">
            Khám phá cách sử dụng hệ thống đấu giá trực tuyến một cách dễ dàng
            và hiệu quả. Chúng tôi sẽ đồng hành cùng bạn từ những bước đầu tiên.
          </Text>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Quick Start Guide */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Title
              level={2}
              className="!mb-4 !font-bold !bg-gradient-to-r !from-blue-600 !to-purple-600 !bg-clip-text !text-transparent"
            >
              Hướng dẫn nhanh 5 bước
            </Title>
            <Text className="!text-slate-600 !text-lg">
              Làm theo 5 bước đơn giản để bắt đầu tham gia đấu giá
            </Text>
          </div>

          <Card className="!bg-white/80 !backdrop-blur-sm !border-0 !shadow-2xl !rounded-3xl">
            <Steps
              current={currentStep}
              onChange={setCurrentStep}
              direction="horizontal"
              size="default"
              className="!mb-8"
              items={steps.map((step, index) => ({
                title: step.title,
                description: step.description,
                icon: step.icon,
                status:
                  index === currentStep
                    ? "process"
                    : index < currentStep
                    ? "finish"
                    : "wait",
              }))}
            />

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {steps[currentStep].icon}
              </div>
              <Title level={3} className="!mb-2">
                {steps[currentStep].title}
              </Title>
              <Paragraph className="!text-lg !text-slate-600 !mb-6">
                {steps[currentStep].content}
              </Paragraph>

              <Space>
                <Button
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="rounded-xl"
                  type="primary"
                >
                  Quay lại
                </Button>
                <Button
                  type="primary"
                  disabled={currentStep === steps.length - 1}
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 border-0 rounded-xl"
                  icon={<RightOutlined />}
                >
                  Tiếp theo
                </Button>
              </Space>
            </div>
          </Card>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Title
              level={2}
              className="!mb-4 !font-bold !bg-gradient-to-r !from-blue-600 !to-purple-600 !bg-clip-text !text-transparent"
            >
              Tính năng nổi bật
            </Title>
            <Text className="!text-slate-600 !text-lg">
              Những tính năng giúp bạn có trải nghiệm đấu giá tốt nhất
            </Text>
          </div>

          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="!h-full !bg-white/80 !backdrop-blur-sm !border-0 !shadow-xl !rounded-2xl !hover:shadow-2xl !transition-all !duration-300 !transform !hover:scale-105">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <Title level={4} className="!mb-3">
                      {feature.title}
                    </Title>
                    <Text className="!text-slate-600 !leading-relaxed">
                      {feature.description}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Detailed Guide */}
        <section className="mb-16">
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <Card className="!h-full !bg-white/80 !backdrop-blur-sm !border-0 !shadow-xl !rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                    <CheckCircleOutlined className="!text-white !text-xl" />
                  </div>
                  <Title level={3} className="!mb-0">
                    Quy trình đấu giá
                  </Title>
                </div>

                <Timeline
                  items={[
                    {
                      color: "blue",
                      children: (
                        <div>
                          <Text strong>Đăng ký tham gia</Text>
                          <br />
                          <Text className="text-slate-600">
                            Hoàn tất thủ tục đăng ký và nộp tiền đặt cọc
                          </Text>
                        </div>
                      ),
                    },
                    {
                      color: "green",
                      children: (
                        <div>
                          <Text strong>Tham gia đấu giá</Text>
                          <br />
                          <Text className="text-slate-600">
                            Đưa ra mức giá trong thời gian quy định
                          </Text>
                        </div>
                      ),
                    },
                    {
                      color: "orange",
                      children: (
                        <div>
                          <Text strong>Công bố kết quả</Text>
                          <br />
                          <Text className="text-slate-600">
                            Xác định người thắng đấu giá
                          </Text>
                        </div>
                      ),
                    },
                    {
                      color: "purple",
                      children: (
                        <div>
                          <Text strong>Thanh toán</Text>
                          <br />
                          <Text className="text-slate-600">
                            Hoàn tất thanh toán và nhận tài sản
                          </Text>
                        </div>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                    <ExclamationCircleOutlined className="text-white text-xl" />
                  </div>
                  <Title level={3} className="!mb-0">
                    Lưu ý quan trọng
                  </Title>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                    <ExclamationCircleOutlined className="text-red-500 mt-1" />
                    <div>
                      <Text strong className="text-red-700">
                        Thời gian thanh toán
                      </Text>
                      <br />
                      <Text className="text-red-600">
                        Phải thanh toán trong vòng 15 ngày sau khi trúng đấu giá
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <InfoCircleOutlined className="text-amber-500 mt-1" />
                    <div>
                      <Text strong className="text-amber-700">
                        Tiền đặt cọc
                      </Text>
                      <br />
                      <Text className="text-amber-600">
                        Sẽ bị mất nếu không thanh toán đúng hạn
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <InfoCircleOutlined className="text-blue-500 mt-1" />
                    <div>
                      <Text strong className="text-blue-700">
                        Xác minh danh tính
                      </Text>
                      <br />
                      <Text className="text-blue-600">
                        Bắt buộc trước khi tham gia đấu giá
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Title
              level={2}
              className="!mb-4 font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              <QuestionCircleOutlined className="mr-3" />
              Câu hỏi thường gặp
            </Title>
            <Text className="text-slate-600 text-lg">
              Giải đáp những thắc mắc phổ biến của người dùng
            </Text>
          </div>

          <Card className="!bg-white/80 !backdrop-blur-sm !border-0 !shadow-xl !rounded-2xl">
            <Collapse
              activeKey={activeKey}
              onChange={setActiveKey}
              ghost
              expandIcon={({ isActive }) => (
                <RightOutlined rotate={isActive ? 90 : 0} />
              )}
              items={faqData}
              className="[&_.ant-collapse-item]:border-0 [&_.ant-collapse-header]:!bg-slate-50 [&_.ant-collapse-header]:!rounded-xl [&_.ant-collapse-header]:!mb-3 [&_.ant-collapse-header]:!font-semibold [&_.ant-collapse-content-box]:!px-4"
            />
          </Card>
        </section>

        {/* Contact Support */}
        <section>
          <Card className="!bg-gradient-to-r !from-blue-600 !via-purple-600 !to-pink-600 border-0 !rounded-3xl !text-white !overflow-hidden">
            <div className="relative z-10">
              <Row gutter={[32, 32]} align="middle">
                <Col xs={24} lg={12}>
                  <Title level={2} className="!text-white !mb-4">
                    Cần hỗ trợ thêm?
                  </Title>
                  <Paragraph className="!text-blue-100 !text-lg !leading-relaxed">
                    Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng hỗ trợ bạn
                    24/7. Liên hệ ngay để được tư vấn chi tiết.
                  </Paragraph>

                  <div className="space-y-3 mt-6">
                    <div className="flex items-center gap-3">
                      <PhoneOutlined className="!text-white !text-lg" />
                      <Text className="!text-white">Hotline: 1900-1234</Text>
                    </div>
                    <div className="flex items-center gap-3">
                      <MailOutlined className="!text-white !text-lg" />
                      <Text className="!text-white">
                        Email: support@digitalauction.vn
                      </Text>
                    </div>
                    <div className="flex items-center gap-3">
                      <GlobalOutlined className="!text-white !text-lg" />
                      <Text className="!text-white">
                        Website: www.digitalauction.vn
                      </Text>
                    </div>
                  </div>
                </Col>

                <Col xs={24} lg={12}>
                  <div className="text-center">
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        size="large"
                        className="!bg-white/20 !border-white/30 !text-white hover:!bg-white/30 !rounded-xl !h-auto !py-4"
                        icon={<PhoneOutlined />}
                      >
                        Gọi điện
                      </Button>
                      <Button
                        size="large"
                        className="!bg-white/20 !border-white/30 !text-white hover:!bg-white/30 !rounded-xl !h-auto !py-4"
                        icon={<MailOutlined />}
                      >
                        Gửi email
                      </Button>
                      <Button
                        size="large"
                        className="!bg-white/20 !border-white/30 !text-white hover:!bg-white/30 !rounded-xl !h-auto !py-4"
                        icon={<HomeOutlined />}
                      >
                        Trang chủ
                      </Button>
                      <Button
                        size="large"
                        className="!bg-white/20 !border-white/30 !text-white hover:!bg-white/30 !rounded-xl !h-auto !py-4"
                        icon={<QuestionCircleOutlined />}
                      >
                        Trợ giúp
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Guidance;
