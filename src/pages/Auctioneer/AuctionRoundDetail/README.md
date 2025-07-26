# AuctionRoundDetail Component

## Mô tả

Component AuctionRoundDetail được thiết kế cho vai trò Auctioneer (người quản lý phiên đấu giá), cho phép quản lý và theo dõi chi tiết một phiên đấu giá.

## Cấu trúc thư mục

```
AuctionRoundDetail/
├── index.tsx                 # Component chính
├── fakeData.ts              # Dữ liệu mẫu
├── styles.css               # CSS tùy chỉnh
├── README.md                # Tài liệu hướng dẫn
└── components/              # Các component con
    ├── index.ts             # Export components
    ├── AuctionHeader.tsx    # Header hiển thị thông tin tổng quan
    ├── PriceHistoryTable.tsx    # Bảng lịch sử trả giá
    ├── HighestBiddersTable.tsx  # Bảng người trả giá cao nhất
    └── AuctionStatistics.tsx    # Thống kê phiên đấu giá
```

## Tính năng

### 1. AuctionHeader

- Hiển thị thông tin phiên đấu giá (ID, trạng thái)
- Thống kê tổng số người tham gia và tài sản
- Status badge với các trạng thái: active, completed, pending
- Thời gian cập nhật realtime

### 2. PriceHistoryTable

- Bảng hiển thị toàn bộ lịch sử trả giá
- Sắp xếp theo giá (ascending/descending)
- Phân trang với tùy chọn số lượng hiển thị
- Responsive design với scroll ngang
- Tìm kiếm và lọc dữ liệu

### 3. HighestBiddersTable

- Hiển thị người trả giá cao nhất cho mỗi tài sản
- **Chức năng xác nhận người chiến thắng**
- Visual feedback với màu sắc và badge
- Chỉ cho phép 1 người chiến thắng cho mỗi tài sản
- Notification khi xác nhận/hủy xác nhận

### 4. AuctionStatistics

- Thống kê tổng quan: số lượt đấu, người tham gia, tài sản
- Thống kê giá: trung bình, cao nhất, thấp nhất
- Top 3 vùng có nhiều người tham gia nhất
- Progress bar hiển thị tỷ lệ theo vùng
- Icons và màu sắc trực quan

## Công nghệ sử dụng

- **React** với TypeScript
- **Ant Design (antd)** - UI Components
- **Tailwind CSS** - Utility-first CSS
- **Ant Design Icons** - Icon library

## Props Interface

```typescript
interface AuctionRoundPrice {
  AuctionRoundId: string;
  UserName: string;
  CitizenIdentification: string;
  RecentLocation: string;
  TagName: string; // Tên tài sản
  AuctionPrice: string;
}
```

## Cách sử dụng

```tsx
import AuctionRoundDetail from "./pages/Auctioneer/AuctionRoundDetail";

function App() {
  return <AuctionRoundDetail />;
}
```

## Tùy chỉnh

### CSS Classes

- `.custom-table` - Tùy chỉnh bảng
- `.custom-tabs` - Tùy chỉnh tabs
- `.loading-shimmer` - Hiệu ứng loading

### Theme Colors

- Primary: #1890ff (Blue)
- Success: #52c41a (Green)
- Warning: #faad14 (Yellow)
- Error: #f5222d (Red)
- Purple: #722ed1

## Responsive Design

- **Mobile (xs)**: < 576px - Stack layout, smaller fonts
- **Tablet (sm)**: ≥ 576px - 2 columns layout
- **Desktop (lg)**: ≥ 992px - Full layout với 3 columns

## Performance

- Pagination để giảm tải dữ liệu lớn
- Memo cho các component con
- Lazy loading cho images
- Virtual scrolling cho bảng lớn

## Accessibility

- ARIA labels cho screen readers
- Keyboard navigation support
- Color contrast tuân thủ WCAG
- Focus indicators rõ ràng

## Browser Support

- Chrome ≥ 70
- Firefox ≥ 60
- Safari ≥ 12
- Edge ≥ 79

## Phát triển tiếp

### Tính năng dự kiến

- [ ] Export dữ liệu Excel/PDF
- [ ] Real-time updates với WebSocket
- [ ] Advanced filters và search
- [ ] Audit trail cho actions
- [ ] Email notifications
- [ ] Mobile app version

### Optimization

- [ ] Code splitting
- [ ] Bundle size optimization
- [ ] Performance monitoring
- [ ] Error boundary implementation
