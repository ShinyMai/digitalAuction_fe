import type { ExtendedAuctionRound, RoundStatss } from '../types';

export const mockRounds: ExtendedAuctionRound[] = [
  {
    AuctionRoundId: '1',
    AuctionId: 'auction-123',
    RoubdNumber: 1,
    Status: 2, // completed
    CreatedAt: '2025-07-24T09:00:00',
    CreatedBy: 'admin',
    startPrice: 1000000000,
    stepPrice: 50000000,
    minParticipants: 3,
    participantCount: 5,
    currentPrice: 1500000000,
    bids: [
      {
        AuctionRoundPriceId: 'bid-1',
        AuctionRoundId: '1',
        UserName: 'Nguyễn Văn A',
        CitezenIdentification: '123456789',
        RecentLocation: 'Hà Nội',
        TagName: 'BID_1',
        AuctionPrice: 1200000000,
        CreatedAt: '2025-07-24T09:10:00',
        CreatedBy: 'user1'
      },
      {
        AuctionRoundPriceId: 'bid-2',
        AuctionRoundId: '1',
        UserName: 'Trần Thị B',
        CitezenIdentification: '987654321',
        RecentLocation: 'Hồ Chí Minh',
        TagName: 'BID_2',
        AuctionPrice: 1500000000,
        CreatedAt: '2025-07-24T09:20:00',
        CreatedBy: 'user2'
      }
    ]
  },
  {
    AuctionRoundId: '2',
    AuctionId: 'auction-123',
    RoubdNumber: 2,
    Status: 1, // in_progress
    CreatedAt: '2025-07-24T09:45:00',
    CreatedBy: 'admin',
    startPrice: 1500000000,
    stepPrice: 50000000,
    minParticipants: 3,
    participantCount: 4,
    currentPrice: 1600000000,
    remainingTime: 600,
    bids: []
  },
  {
    AuctionRoundId: '3',
    AuctionId: 'auction-123',
    RoubdNumber: 3,
    Status: 0, // waiting
    CreatedAt: '2025-07-24T10:30:00',
    CreatedBy: 'admin',
    startPrice: 1600000000,
    stepPrice: 50000000,
    minParticipants: 3,
    participantCount: 0,
    currentPrice: 1600000000,
    bids: []
  }
];

export const mockStats: RoundStatss = {
  totalRounds: 3,
  completedRounds: 1,
  activeRounds: 1,
  totalParticipants: 9,
  averagePriceIncrease: 100000000
};
