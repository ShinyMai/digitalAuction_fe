import type { Dayjs } from 'dayjs';
import type { AuctionRound, AuctionRoundPrice } from '../../ModalsDatabase';

/**
 * Mở rộng interface AuctionRound từ ModalsDatabase
 * Special Note: Cần thêm các trường sau vào ModalsDatabase.ts:
 * - startPrice: number - Giá khởi điểm của vòng đấu giá
 * - stepPrice: number - Bước giá tối thiểu
 * - minParticipants: number - Số người tham gia tối thiểu
 * - participantCount: number - Số người đang tham gia
 * - currentPrice: number - Giá hiện tại
 * - remainingTime?: number - Thời gian còn lại (giây)
 */
export interface ExtendedAuctionRound extends AuctionRound {
  startPrice: number;
  stepPrice: number;
  minParticipants: number;
  participantCount: number;
  currentPrice: number;
  remainingTime?: number;
  bids: AuctionRoundPrice[];
}

export interface RoundStatss {
  totalRounds: number;
  completedRounds: number;
  activeRounds: number;
  totalParticipants: number;
  averagePriceIncrease: number;
}

export interface CreateRoundFormData {
  startTime: Dayjs;
  duration: number; // Thời gian diễn ra (phút)
  startPrice: number;
  stepPrice: number;
  minParticipants: number;
}

// Props interfaces
export interface CreateRoundModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateRoundFormData) => Promise<void>;
  loading?: boolean;
}

export interface RoundDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  roundData?: ExtendedAuctionRound;
}

export interface RoundManagementProps {
  auctionId: string;
}

// API Response Types
export interface GetRoundsResponse {
  rounds: ExtendedAuctionRound[];
  stats: RoundStatss;
}

export interface CreateRoundResponse {
  round: ExtendedAuctionRound;
}

export interface UpdateRoundResponse {
  round: ExtendedAuctionRound;
}

export interface RoundDetailResponse {
  round: ExtendedAuctionRound;
}
