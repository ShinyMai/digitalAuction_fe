import type { 
    PerformanceStats, 
    AuctionPerformance, 
    ParticipantStats, 
    RevenueData, 
    TopAsset 
} from './types';

export const performanceStats: PerformanceStats = {
    totalAuctions: 45,
    completedAuctions: 38,
    cancelledAuctions: 3,
    successRate: 84.4,
    averageParticipants: 12,
    totalRevenue: 2850000000, // 2.85 tỷ VND
};

export const participantStats: ParticipantStats = {
    totalParticipants: 547,
    activeParticipants: 234,
    newParticipants: 89,
    returningParticipants: 145,
    blacklistedUsers: 12,
};

export const auctionPerformanceData: AuctionPerformance[] = [
    {
        auctionId: "1",
        auctionName: "Đấu giá Bất động sản Quận 1",
        date: "2025-07-20",
        participants: 18,
        completedRounds: 3,
        revenue: 450000000,
        duration: 180,
        status: "Hoàn thành"
    },
    {
        auctionId: "2", 
        auctionName: "Đấu giá Xe ô tô thanh lý",
        date: "2025-07-18",
        participants: 15,
        completedRounds: 2,
        revenue: 320000000,
        duration: 120,
        status: "Hoàn thành"
    },
    {
        auctionId: "3",
        auctionName: "Đấu giá Tài sản tịch thu",
        date: "2025-07-15",
        participants: 8,
        completedRounds: 1,
        revenue: 180000000,
        duration: 90,
        status: "Hoàn thành"
    },
    {
        auctionId: "4",
        auctionName: "Đấu giá Máy móc công nghiệp",
        date: "2025-07-12",
        participants: 22,
        completedRounds: 4,
        revenue: 680000000,
        duration: 240,
        status: "Hoàn thành"
    },
    {
        auctionId: "5",
        auctionName: "Đấu giá Tranh nghệ thuật",
        date: "2025-07-10",
        participants: 12,
        completedRounds: 2,
        revenue: 250000000,
        duration: 150,
        status: "Hoàn thành"
    }
];

export const revenueChartData: RevenueData[] = [
    { period: "T1/2025", revenue: 580000000, fees: 45000000, deposits: 120000000, auctions: 8 },
    { period: "T2/2025", revenue: 720000000, fees: 52000000, deposits: 145000000, auctions: 12 },
    { period: "T3/2025", revenue: 650000000, fees: 48000000, deposits: 135000000, auctions: 10 },
    { period: "T4/2025", revenue: 890000000, fees: 68000000, deposits: 180000000, auctions: 15 },
    { period: "T5/2025", revenue: 760000000, fees: 55000000, deposits: 155000000, auctions: 11 },
    { period: "T6/2025", revenue: 920000000, fees: 72000000, deposits: 195000000, auctions: 16 },
    { period: "T7/2025", revenue: 850000000, fees: 62000000, deposits: 170000000, auctions: 13 }
];

export const topAssets: TopAsset[] = [
    {
        assetId: "1",
        tagName: "Villa Thảo Điền",
        startingPrice: 15000000000,
        finalPrice: 28500000000,
        participants: 18,
        auctionName: "Đấu giá Bất động sản Quận 1"
    },
    {
        assetId: "2",
        tagName: "Mercedes S-Class 2022",
        startingPrice: 3200000000,
        finalPrice: 4800000000,
        participants: 15,
        auctionName: "Đấu giá Xe ô tô thanh lý"
    },
    {
        assetId: "3",
        tagName: "Máy ép thủy lực 500T",
        startingPrice: 800000000,
        finalPrice: 1350000000,
        participants: 22,
        auctionName: "Đấu giá Máy móc công nghiệp"
    },
    {
        assetId: "4",
        tagName: "Tranh sơn dầu cổ",
        startingPrice: 120000000,
        finalPrice: 340000000,
        participants: 12,
        auctionName: "Đấu giá Tranh nghệ thuật"
    },
    {
        assetId: "5",
        tagName: "BMW X7 2023",
        startingPrice: 4500000000,
        finalPrice: 6200000000,
        participants: 14,
        auctionName: "Đấu giá Xe ô tô thanh lý"
    }
];

// Data cho biểu đồ tròn phân bố danh mục
export const categoryDistribution = [
    { name: "Bất động sản", value: 45, color: "#1890ff" },
    { name: "Xe cộ", value: 25, color: "#52c41a" },
    { name: "Máy móc", value: 15, color: "#faad14" },
    { name: "Nghệ thuật", value: 10, color: "#f5222d" },
    { name: "Khác", value: 5, color: "#722ed1" }
];

// Data cho biểu đồ số người tham gia theo tháng
export const participantTrendData = [
    { month: "T1", participants: 156, newUsers: 45 },
    { month: "T2", participants: 189, newUsers: 52 },
    { month: "T3", participants: 167, newUsers: 38 },
    { month: "T4", participants: 234, newUsers: 67 },
    { month: "T5", participants: 198, newUsers: 41 },
    { month: "T6", participants: 267, newUsers: 78 },
    { month: "T7", participants: 234, newUsers: 58 }
];
