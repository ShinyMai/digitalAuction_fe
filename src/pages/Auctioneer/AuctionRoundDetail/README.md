# AuctionRoundDetail Component

## Overview

Màn hình chi tiết vòng đấu giá hiển thị tất cả thông tin về các lượt trả giá, thống kê, và phân tích dữ liệu của một vòng đấu giá cụ thể.

## Features

### 📊 **StatsOverview Component**

- Thống kê tổng quan với 8 metrics chính
- Design card gradient với hover effects
- Real-time loading states
- Responsive grid layout (1-2-4 columns)

**Metrics hiển thị:**

- Tổng lượt trả giá & số người tham gia
- Giá cao nhất với icon trophy
- Giá trung bình với progress bar
- Bước giá tối thiểu
- Vị trí có nhiều bid nhất
- Thời gian bid đầu tiên
- Tốc độ trả giá (lượt/phút)

### 📋 **BidList Component**

- Table hiển thị tất cả lượt trả giá
- Search & filter functionality
- Sorting theo giá và thời gian
- Rank system với visual indicators
- Winner highlighting với green background
- Responsive pagination
- Export functionality

**Columns:**

- Xếp hạng (với icons đặc biệt cho top 3)
- Thông tin người trả giá (avatar + tên + CCCD)
- Vị trí địa lý
- Giá trả (với currency formatting)
- Thời gian (với relative time)
- Trạng thái (winning/top/participate tags)

### 🏆 **TopBidders Component**

- Card list của top bidders
- Gradient backgrounds cho top 3
- Stats cho mỗi bidder:
  - Giá cao nhất
  - Số lượt trả giá
  - Giá trung bình với progress bar
  - Thời gian bid cuối
- Special indicators cho winner
- Responsive layout

### ⏱️ **BidTimeline Component**

- Timeline hiển thị chronological order
- Milestone markers (every 5 bids)
- Record breaker highlighting
- Interactive events với hover
- Color-coded timeline dots
- Event details với formatted prices

## API Integration

### Endpoints Required

```typescript
// Main detail endpoint
GET /api/auction-rounds/{roundId}/detail
Response: RoundDetailData

// Paginated bids
GET /api/auction-rounds/{roundId}/prices?page=1&limit=20
Response: { prices: ExtendedAuctionRoundPrice[], total: number }

// Stats only
GET /api/auction-rounds/{roundId}/stats
Response: RoundDetailStats

// Top bidders
GET /api/auction-rounds/{roundId}/top-bidders?limit=10
Response: BidderInfo[]

// Export functionality
POST /api/auction-rounds/{roundId}/export
Body: { format: 'excel' | 'pdf', includeStats: boolean }
Response: File download
```

## Data Types

### Core Types

```typescript
interface RoundDetailData {
  round: AuctionRound;
  prices: ExtendedAuctionRoundPrice[];
  stats: RoundDetailStats;
  topBidders: BidderInfo[];
  winningBids: ExtendedAuctionRoundPrice[];
}

interface RoundDetailStats {
  totalBids: number;
  uniqueBidders: number;
  highestBid: number;
  lowestBid: number;
  averageBid: number;
  bidIncrement: number;
  timeRange: { firstBid: string; lastBid: string };
  topBidderLocation: string;
}
```

## Design System

### Color Palette

- **Blue**: Primary actions, general stats
- **Green**: Success, winners, highest bids
- **Yellow/Gold**: Top performers, records
- **Purple**: Timeline, milestones
- **Orange**: Secondary metrics
- **Red**: Urgent actions

### Responsive Breakpoints

- **Mobile**: < 640px (1 column layouts)
- **Tablet**: 640px - 1024px (2 column layouts)
- **Desktop**: > 1024px (3-4 column layouts)

### Animations

- **Hover Effects**: Scale, shadow, color transitions
- **Loading States**: Skeleton animations
- **Transitions**: 200-300ms duration
- **Progress Bars**: Smooth value changes

## Usage

### Basic Implementation

```tsx
import AuctionRoundDetail from "@/pages/Auctioneer/AuctionRoundDetail";

// In routing
<Route path="/auctioneer/rounds/:roundId" element={<AuctionRoundDetail />} />;
```

### Navigation Integration

```tsx
// From rounds list
navigate(`/auctioneer/rounds/${roundId}`);

// With state
navigate(`/auctioneer/rounds/${roundId}`, {
  state: { auctionId, roundNumber },
});
```

## Customization

### Theme Colors

Có thể customize colors thông qua Tailwind config:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        auction: {
          primary: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
        },
      },
    },
  },
};
```

### Component Props

```typescript
// StatsOverview
interface StatsOverviewProps {
  stats: RoundDetailStats;
  loading?: boolean;
}

// BidList
interface BidListProps {
  bids: ExtendedAuctionRoundPrice[];
  loading?: boolean;
  onRefresh?: () => void;
}
```

## Performance Considerations

### Optimization Features

- **Virtual Scrolling**: For large bid lists (>1000 items)
- **Memoization**: React.memo for expensive components
- **Lazy Loading**: Components and data
- **Debounced Search**: 300ms delay
- **Pagination**: 20 items per page default

### Bundle Size

- **Main Component**: ~45KB gzipped
- **Dependencies**: Antd icons, date formatting
- **Total Impact**: ~60KB additional

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## Testing

### Unit Tests Required

- [ ] Stats calculations
- [ ] Currency formatting
- [ ] Time formatting
- [ ] Filter functionality
- [ ] Sort functionality

### Integration Tests

- [ ] API calls
- [ ] Navigation
- [ ] Export functionality
- [ ] Real-time updates

## Future Enhancements

- [ ] Real-time updates via WebSocket
- [ ] Advanced filtering (date range, price range)
- [ ] Chart visualizations
- [ ] PDF report generation
- [ ] Mobile app optimization
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Dark mode support
