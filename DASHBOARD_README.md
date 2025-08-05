# 📊 Dashboard Thống Kê cho Manager và Director

## 🎯 Tổng Quan

Đây là thiết kế màn hình dashboard thống kê cho 2 role:

- **Manager Dashboard**: Tập trung vào quản lý và phê duyệt
- **Director Dashboard**: Tập trung vào strategic insights và business intelligence

## 🏗️ Cấu Trúc Files

### Manager Dashboard

```
src/pages/Manager/Dashboard/
├── index.tsx                    # Main dashboard component
└── components/
    ├── BusinessOverview.tsx     # Tổng quan kinh doanh
    ├── ApprovalManagement.tsx   # Quản lý phê duyệt
    ├── PerformanceAnalytics.tsx # Phân tích hiệu suất
    ├── RevenueChart.tsx         # Biểu đồ doanh thu
    └── ApprovalWorkflow.tsx     # Quy trình phê duyệt
```

### Director Dashboard

```
src/pages/Director/Dashboard/
├── index.tsx                     # Main executive dashboard
└── components/
    ├── ExecutiveSummary.tsx      # Tóm tắt điều hành
    ├── StrategicOverview.tsx     # Tổng quan chiến lược
    ├── FinancialAnalytics.tsx    # Phân tích tài chính
    ├── OperationalExcellence.tsx # Xuất sắc vận hành
    └── MarketAnalysis.tsx        # Phân tích thị trường
```

## 🚀 Features

### Manager Dashboard

- **📈 Business Overview**: Metrics chính về doanh nghiệp
- **⏳ Approval Management**: Quản lý hồ sơ chờ phê duyệt
- **👥 Performance Analytics**: Phân tích hiệu suất nhân viên
- **💰 Revenue Chart**: Biểu đồ xu hướng doanh thu
- **🔄 Approval Workflow**: Workflow phê duyệt với bottleneck detection

### Director Dashboard

- **🎯 Executive KPIs**: Key Performance Indicators cấp cao
- **📊 Strategic Goals**: Tiến độ các mục tiêu chiến lược
- **💼 Financial Health**: Đánh giá sức khỏe tài chính
- **🌍 Market Analysis**: Phân tích thị trường và cạnh tranh
- **⚡ Operational Excellence**: Xuất sắc trong vận hành

## 🛠️ Setup & Integration

### 1. Routing đã được cấu hình:

- Manager: `/manager/statistics`
- Director: `/director/statistics`

### 2. Navigation Menu:

Đã cập nhật `SiderRouteOption.tsx` để hiển thị menu thống kê cho Manager và Director.

### 3. API Integration:

Các component đã được chuẩn bị để tích hợp API:

```typescript
// Manager APIs
GET / api / manager / business - overview;
GET / api / manager / approval - metrics;
GET / api / manager / performance - analytics;

// Director APIs
GET / api / director / executive - kpis;
GET / api / director / strategic - goals;
GET / api / director / financial - analytics;
GET / api / director / market - analysis;
```

## 🎨 Design Features

### Manager Dashboard

- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live data với loading states
- **Interactive Filters**: Date range và department filters
- **Workflow Visualization**: Steps component cho approval process
- **Alert System**: Bottleneck detection và warnings

### Director Dashboard

- **Executive Layout**: Premium look với gradient backgrounds
- **KPI Cards**: Visual status indicators với progress bars
- **Risk Dashboard**: Risk assessment với color-coded indicators
- **Market Insights**: Competitive analysis với charts
- **Financial Health Score**: Overall score với breakdown metrics

## 📱 Responsive Design

Cả hai dashboard đều được thiết kế responsive:

- **Mobile (xs)**: Stacked layout, simplified views
- **Tablet (sm/md)**: 2-column grids
- **Desktop (lg/xl)**: Full multi-column layouts
- **Large screens (xxl)**: Enhanced spacing và bigger components

## 🔧 Customization

### Thêm Component Mới:

1. Tạo component trong folder `components/`
2. Import vào main dashboard file
3. Thêm loading state và error handling
4. Cập nhật TypeScript interfaces

### Thêm API Calls:

```typescript
const fetchDashboardData = async () => {
  setLoading(true);
  try {
    const [overview, metrics] = await Promise.all([
      getBusinessOverview(),
      getApprovalMetrics(),
    ]);
    // Update state
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setLoading(false);
  }
};
```

## 🚦 Next Steps

1. **API Integration**: Kết nối với backend APIs
2. **Chart Implementation**: Sử dụng @ant-design/plots hoặc recharts
3. **Real-time Updates**: WebSocket cho live data
4. **Export Functions**: PDF/Excel export cho reports
5. **Permission System**: Role-based access control

## 💡 Best Practices

- Sử dụng lazy loading cho components
- Implement error boundaries
- Cache data với React Query
- Optimize re-renders với useMemo/useCallback
- Implement skeleton loading states
- Add accessibility features

## 🔗 Related Files

- `src/routers/roleBased.routes.tsx` - Routing configuration
- `src/layouts/CompanyLayout/Components/SiderRouteOption.tsx` - Navigation menu
- `src/hooks/useAppRouting.ts` - Role-based routing logic

Các dashboard này sẵn sàng để tích hợp với backend và có thể được customized theo yêu cầu cụ thể của dự án!
