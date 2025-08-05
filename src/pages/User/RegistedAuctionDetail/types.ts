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
  bankAccount: string;
  bankAccountNumber: string;
  bankBranch: string;
}

// Auction status data from API
export interface AuctionStatusData {
  price: number;
  flag: boolean;
}

export interface AuctionStatusResponse {
  code: number;
  message: string;
  data: {
    data: {
      [auctionDocumentsId: string]: AuctionStatusData[];
    };
  };
}

// Additional document interface for detail view
export interface DocumentDetail {
  documentId: string;
  documentName: string;
  documentType: string;
  uploadDate: string;
  fileSize: number;
  status: "pending" | "approved" | "rejected";
}

export interface RegistedAuctionDetailData {
  auctionId: string;
  auctionName: string;
  auctionStartDate: string;
  auctionEndDate: string;
  documents: DocumentDetail[];
  totalDocuments: number;
  approvedDocuments: number;
  pendingDocuments: number;
  rejectedDocuments: number;
  depositAmount: number;
  depositStatus: number;
  depositDate?: string;
  ticketNumber?: string;
  ticketStatus: number;
  ticketIssueDate?: string;
}

export interface AuctionDocumentResponse {
  code: number;
  message: string;
  data: AuctionDocument[];
}

export type DepositStatus = 0 | 1; // 0: Pending, 1: Paid, 2: Refunded
export type TicketStatus = 0 | 1 | 2 | 3; // 0: Pending, 1: Approved, 2: Rejected

export interface StatusInfo {
  color: string;
  text: string;
  bgColor: string;
  icon: React.ReactNode;
}
