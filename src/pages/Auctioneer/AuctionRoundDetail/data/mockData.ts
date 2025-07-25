import type { RoundDetailData, ExtendedAuctionRoundPrice, BidderInfo, RoundDetailStats } from '../types';

// Mock data cho auction round prices
export const mockAuctionRoundPrices: ExtendedAuctionRoundPrice[] = [
  {
    AuctionRoundPriceId: '1',
    AuctionRoundId: 'round-1',
    UserName: 'Nguyễn Văn A',
    CitezenIdentification: '123456789',
    RecentLocation: 'Hà Nội',
    TagName: 'Đất thổ cư Q1',
    AuctionPrice: 2500000000,
    CreatedAt: '2025-01-25T14:30:00Z',
    CreatedBy: 'user-1',
    rank: 1,
    timeFromStart: '30 phút',
    isWinning: true
  },
  {
    AuctionRoundPriceId: '2',
    AuctionRoundId: 'round-1',
    UserName: 'Trần Thị B',
    CitezenIdentification: '987654321',
    RecentLocation: 'TP.HCM',
    TagName: 'Đất thổ cư Q1',
    AuctionPrice: 2400000000,
    CreatedAt: '2025-01-25T14:25:00Z',
    CreatedBy: 'user-2',
    rank: 2,
    timeFromStart: '25 phút',
    isWinning: false
  },
  {
    AuctionRoundPriceId: '3',
    AuctionRoundId: 'round-1',
    UserName: 'Lê Văn C',
    CitezenIdentification: '456789123',
    RecentLocation: 'Đà Nẵng',
    TagName: 'Đất thổ cư Q1',
    AuctionPrice: 2300000000,
    CreatedAt: '2025-01-25T14:20:00Z',
    CreatedBy: 'user-3',
    rank: 3,
    timeFromStart: '20 phút',
    isWinning: false
  },
  {
    AuctionRoundPriceId: '4',
    AuctionRoundId: 'round-1',
    UserName: 'Phạm Thị D',
    CitezenIdentification: '789123456',
    RecentLocation: 'Hà Nội',
    TagName: 'Đất thổ cư Q1',
    AuctionPrice: 2200000000,
    CreatedAt: '2025-01-25T14:15:00Z',
    CreatedBy: 'user-4',
    rank: 4,
    timeFromStart: '15 phút',
    isWinning: false
  },
  {
    AuctionRoundPriceId: '5',
    AuctionRoundId: 'round-1',
    UserName: 'Hoàng Văn E',
    CitezenIdentification: '321654987',
    RecentLocation: 'Cần Thơ',
    TagName: 'Đất thổ cư Q1',
    AuctionPrice: 2100000000,
    CreatedAt: '2025-01-25T14:10:00Z',
    CreatedBy: 'user-5',
    rank: 5,
    timeFromStart: '10 phút',
    isWinning: false
  },
  {
    AuctionRoundPriceId: '6',
    AuctionRoundId: 'round-1',
    UserName: 'Nguyễn Văn A',
    CitezenIdentification: '123456789',
    RecentLocation: 'Hà Nội',
    TagName: 'Đất thổ cư Q1',
    AuctionPrice: 2000000000,
    CreatedAt: '2025-01-25T14:05:00Z',
    CreatedBy: 'user-1',
    rank: 6,
    timeFromStart: '5 phút',
    isWinning: false
  }
];

// Mock bidder info
export const mockBidderInfo: BidderInfo[] = [
  {
    userName: 'Nguyễn Văn A',
    citizenId: '123456789',
    location: 'Hà Nội',
    totalBids: 2,
    highestBid: 2500000000,
    averageBid: 2250000000,
    bidTimes: ['2025-01-25T14:05:00Z', '2025-01-25T14:30:00Z']
  },
  {
    userName: 'Trần Thị B',
    citizenId: '987654321',
    location: 'TP.HCM',
    totalBids: 1,
    highestBid: 2400000000,
    averageBid: 2400000000,
    bidTimes: ['2025-01-25T14:25:00Z']
  },
  {
    userName: 'Lê Văn C',
    citizenId: '456789123',
    location: 'Đà Nẵng',
    totalBids: 1,
    highestBid: 2300000000,
    averageBid: 2300000000,
    bidTimes: ['2025-01-25T14:20:00Z']
  }
];

// Mock stats
export const mockStats: RoundDetailStats = {
  totalBids: 6,
  uniqueBidders: 5,
  highestBid: 2500000000,
  lowestBid: 2000000000,
  averageBid: 2300000000,
  bidIncrement: 100000000,
  timeRange: {
    firstBid: '2025-01-25T14:05:00Z',
    lastBid: '2025-01-25T14:30:00Z'
  },
  topBidderLocation: 'Hà Nội'
};

// Mock round data
export const mockRoundDetailData: RoundDetailData = {
  round: {
    AuctionRoundId: 'round-1',
    AuctionId: 'auction-1',
    RoubdNumber: 1,
    Status: 1,
    CreatedAt: '2025-01-25T14:00:00Z',
    CreatedBy: 'auctioneer-1'
  },
  prices: mockAuctionRoundPrices,
  stats: mockStats,
  topBidders: mockBidderInfo,
  winningBids: mockAuctionRoundPrices.filter(p => p.isWinning)
};
