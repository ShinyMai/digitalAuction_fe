export interface PerformanceStats {
    totalAuctions: number;
    completedAuctions: number;
    cancelledAuctions: number;
    successRate: number;
    averageParticipants: number;
    totalRevenue: number;
}

export interface AuctionPerformance {
    auctionId: string;
    auctionName: string;
    date: string;
    participants: number;
    completedRounds: number;
    revenue: number;
    duration: number; // in minutes
    status: string;
}

export interface ParticipantStats {
    totalParticipants: number;
    activeParticipants: number;
    newParticipants: number;
    returningParticipants: number;
    blacklistedUsers: number;
}

export interface RevenueData {
    period: string;
    revenue: number;
    fees: number;
    deposits: number;
    auctions: number;
}

export interface TopAsset {
    assetId: string;
    tagName: string;
    startingPrice: number;
    finalPrice: number;
    participants: number;
    auctionName: string;
}

export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface ReportFilters {
    dateRange: DateRange;
    auctionCategory?: string;
    status?: number;
    auctioneer?: string;
}
