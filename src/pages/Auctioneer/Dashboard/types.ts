import type { Auctions, AuctionAsset, AuctionCategory, Noctification } from '../ModalsDatabase';

export interface DashboardAuction extends Auctions {
    asset: AuctionAsset;
    participantCount: number;
    documentCount: number;
    category: AuctionCategory;
}

export interface CompletedAuction extends DashboardAuction {
    finalPrice: number;
    successRate: number;
}

export interface DashboardStatistics {
    totalAuctions: number;
    completedAuctions: number;
    pendingAuctions: number;
    cancelledAuctions: number;
    totalParticipants: number;
    totalValue: number;
    monthlyStats: Array<{
        month: string;
        auctions: number;
        completedAuctions: number;
        totalValue: number;
        participantCount: number;
    }>;
}

export interface AuctioneerNotification extends Noctification {
    auction?: {
        AuctionId: string;
        AuctionName: string;
        Status: number;
    };
}

export interface CalendarEvent {
    AuctionId: string;
    AuctionName: string;
    AuctionStartDate: string;
    AuctionEndDate: string;
    Status: number;
    type: 'auction' | 'document_review';
    asset?: {
        AssetId: string;
        TagName: string;
        StartingPrice: number;
    };
    participantCount?: number;
    documentCount?: number;
}

export interface PerformanceMetrics {
    metrics: {
        auctionSuccessRate: {
            current: number;
            previous: number;
            change: number;
        };
        documentProcessingRate: {
            current: number;
            previous: number;
            change: number;
        };
        averageResponseTime: {
            current: number;
            previous: number;
            change: number;
        };
    };
    dailyStats: Array<{
        date: string;
        completedAuctions: number;
        processedDocuments: number;
        averageResponseTime: number;
        totalParticipants: number;
    }>;
    assetTypeStats: Array<{
        categoryId: string;
        categoryName: string;
        totalAuctions: number;
        successRate: number;
        totalValue: number;
    }>;
}
