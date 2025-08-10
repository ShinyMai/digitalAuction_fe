export interface ParticipantInfo {
  name: string;
  citizenIdentification: string;
  auctionId?: string;
  userId?: string;
}

export interface RegisteredAuction {
  auctionId: string;
  auctionName: string;
  categoryName: string;
  auctionDescription: string;
  registerOpenDate: string;
  registerEndDate: string;
  auctionStartDate: string;
  auctionEndDate: string;
  status: number;
  totalAssets: number;
  totalDeposit: number;
  totalRegistrationFee: number;
}

export interface AuctionDocument {
  auctionDocumentsId: string;
  citizenIdentification: string;
  deposit: number;
  name: string;
  note: string | null;
  numericalOrder: number;
  registrationFee: number;
  statusDeposit: number;
  statusTicket: number;
  tagName: string;
  bankAccount?: string;
  bankAccountNumber?: string;
  bankBranch?: string;
}

export interface Statistics {
  totalRegistrations: number;
  totalDeposit: number;
  totalRegistrationFee: number;
  approvedTickets: number;
  pendingTickets: number;
  paidDeposits: number;
  pendingDeposits: number;
  refundedDeposits: number;
}

export interface OverallStatistics {
  totalAuctionsParticipated: number;
  totalRegistrations: number;
  totalDeposit: number;
  totalRegistrationFee: number;
  totalApprovedTickets: number;
  totalPendingTickets: number;
  totalRejectedTickets: number;
  totalPaidDeposits: number;
  totalPendingDeposits: number;
  totalRefundedDeposits: number;
  winRate: number;
  averageDepositPerRegistration: number;
  averageRegistrationFeePerRegistration: number;
  totalAmountSpent: number;
}

export interface ParticipantBiddingHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  participantInfo: ParticipantInfo | null;
}

export type ViewMode = "list" | "detail";
