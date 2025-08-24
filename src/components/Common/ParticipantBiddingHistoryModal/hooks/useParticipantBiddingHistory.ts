import { useState, useCallback } from "react";
import { message } from "antd";
import AuctionServices from "../../../../services/AuctionServices";
import type {
  OverallStatistics,
  ParticipantInfo,
  RegisteredAuction,
  Statistics,
  ViewMode,
} from "../types";
import type { AuctionDocument } from "../../../../pages/Staff/Modals";

export const useParticipantBiddingHistory = (
  participantInfo: ParticipantInfo | null
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [registeredAuctions, setRegisteredAuctions] = useState<
    RegisteredAuction[]
  >([]);
  const [documents, setDocuments] = useState<AuctionDocument[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalRegistrations: 0,
    totalDeposit: 0,
    totalRegistrationFee: 0,
    approvedTickets: 0,
    pendingTickets: 0,
    paidDeposits: 0,
    pendingDeposits: 0,
    refundedDeposits: 0,
  });
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [overallStatistics, setOverallStatistics] = useState<OverallStatistics>(
    {
      totalAuctionsParticipated: 0,
      totalRegistrations: 0,
      totalDeposit: 0,
      totalRegistrationFee: 0,
      totalApprovedTickets: 0,
      totalPendingTickets: 0,
      totalRejectedTickets: 0,
      totalPaidDeposits: 0,
      totalPendingDeposits: 0,
      totalRefundedDeposits: 0,
      winRate: 0,
      averageDepositPerRegistration: 0,
      averageRegistrationFeePerRegistration: 0,
      totalAmountSpent: 0,
    }
  );
  // Calculate statistics from documents
  const calculateStatistics = useCallback((docs: AuctionDocument[]) => {
    const stats: Statistics = {
      totalRegistrations: docs.length,
      totalDeposit: docs.reduce((sum, doc) => sum + (doc.deposit || 0), 0),
      totalRegistrationFee: docs.reduce(
        (sum, doc) => sum + (doc.registrationFee || 0),
        0
      ),
      // statusTicket: 0-Chưa chuyển tiền, 1-Đã chuyển tiền, 2-Đã nhận phiếu, 3-Đã hoàn tiền
      approvedTickets: docs.filter((doc) => doc.statusTicket === 2).length,
      pendingTickets: docs.filter(
        (doc) => doc.statusTicket === 0 || doc.statusTicket === 1
      ).length,
      // statusDeposit: 0-Chưa cọc, 1-Đã cọc, 2-Đã hoàn tiền cọc
      paidDeposits: docs.filter((doc) => doc.statusDeposit === 1).length, // Đã cọc
      pendingDeposits: docs.filter((doc) => doc.statusDeposit === 0).length, // Chưa cọc
      refundedDeposits: docs.filter((doc) => doc.statusDeposit === 2).length, // Đã hoàn tiền cọc
    };
    setStatistics(stats);
  }, []);

  // Calculate overall statistics
  const calculateOverallStatistics = useCallback(async () => {
    if (!participantInfo?.citizenIdentification) return;

    try {
      setLoading(true);
      let allDocuments: AuctionDocument[] = [];

      // Fetch documents from all registered auctions
      for (const auction of registeredAuctions) {
        try {
          const response = await AuctionServices.getListAuctionDocumentRegisted(
            {
              auctionId: auction.auctionId,
              userId:
                participantInfo.userId || participantInfo.citizenIdentification,
            }
          );

          if (response.code === 200 && response.data) {
            const participantDocuments = response.data.filter(
              (doc: AuctionDocument) =>
                doc.citizenIdentification ===
                participantInfo.citizenIdentification
            );
            allDocuments = [...allDocuments, ...participantDocuments];
          }
        } catch (error) {
          console.error(
            `Error fetching documents for auction ${auction.auctionId}:`,
            error
          );
        }
      } // Calculate overall statistics
      const totalRegistrations = allDocuments.length;
      const totalDeposit = allDocuments.reduce(
        (sum, doc) => sum + (doc.deposit || 0),
        0
      );
      const totalRegistrationFee = allDocuments.reduce(
        (sum, doc) => sum + (doc.registrationFee || 0),
        0
      );
      // statusTicket: 0-Chưa chuyển tiền, 1-Đã chuyển tiền, 2-Đã nhận phiếu, 3-Đã hoàn tiền
      const totalApprovedTickets = allDocuments.filter(
        (doc) => doc.statusTicket === 2
      ).length; // Đã nhận phiếu
      const totalPendingTickets = allDocuments.filter(
        (doc) => doc.statusTicket === 0 || doc.statusTicket === 1
      ).length; // Chưa chuyển tiền + Đã chuyển tiền
      const totalRejectedTickets = allDocuments.filter(
        (doc) => doc.statusTicket === 3
      ).length; // Đã hoàn tiền
      // statusDeposit: 0-Chưa cọc, 1-Đã cọc, 2-Đã hoàn tiền cọc
      const totalPaidDeposits = allDocuments.filter(
        (doc) => doc.statusDeposit === 1
      ).length; // Đã cọc
      const totalPendingDeposits = allDocuments.filter(
        (doc) => doc.statusDeposit === 0
      ).length; // Chưa cọc
      const totalRefundedDeposits = allDocuments.filter(
        (doc) => doc.statusDeposit === 2
      ).length; // Đã hoàn tiền cọc

      const stats: OverallStatistics = {
        totalAuctionsParticipated: registeredAuctions.length,
        totalRegistrations,
        totalDeposit,
        totalRegistrationFee,
        totalApprovedTickets,
        totalPendingTickets,
        totalRejectedTickets,
        totalPaidDeposits,
        totalPendingDeposits,
        totalRefundedDeposits,
        winRate:
          totalApprovedTickets > 0
            ? (totalApprovedTickets / totalRegistrations) * 100
            : 0,
        averageDepositPerRegistration:
          totalRegistrations > 0 ? totalDeposit / totalRegistrations : 0,
        averageRegistrationFeePerRegistration:
          totalRegistrations > 0
            ? totalRegistrationFee / totalRegistrations
            : 0,
        totalAmountSpent: totalDeposit + totalRegistrationFee,
      };

      setOverallStatistics(stats);
    } catch (error) {
      console.error("Error calculating overall statistics:", error);
      message.error("Không thể tính toán thống kê tổng hợp");
    } finally {
      setLoading(false);
    }
  }, [participantInfo, registeredAuctions]);

  // Reset statistics
  const resetStatistics = useCallback(() => {
    setStatistics({
      totalRegistrations: 0,
      totalDeposit: 0,
      totalRegistrationFee: 0,
      approvedTickets: 0,
      pendingTickets: 0,
      paidDeposits: 0,
      pendingDeposits: 0,
      refundedDeposits: 0,
    });
  }, []);

  // Fetch registered auctions
  const fetchRegisteredAuctions = useCallback(async () => {
    if (!participantInfo?.userId) {
      console.warn("No userId found in participantInfo:", participantInfo);
      message.warning("Không tìm thấy userId của người tham gia");
      setRegisteredAuctions([]);
      return;
    }

    try {
      setLoading(true);

      const requestBody = {
        userId: participantInfo.userId,
        pageNumber: 1,
        pageSize: 100,
        search: {
          auctionName: null,
          auctionStartDate: null,
          auctionEndDate: null,
        },
      };

      const response = await AuctionServices.getListAuctionRegisted(
        requestBody
      );

      if (response?.code === 200) {
        const auctionData = response.data?.auctionResponse || [];
        setRegisteredAuctions(Array.isArray(auctionData) ? auctionData : []);
      } else {
        message.warning("Không tìm thấy phiên đấu giá đã đăng ký nào");
        setRegisteredAuctions([]);
      }
    } catch (error) {
      console.error("Error fetching registered auctions:", error);
      setRegisteredAuctions([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantInfo?.userId]);

  const fetchParticipantData = useCallback(async () => {
    if (!selectedAuctionId || !participantInfo?.citizenIdentification) return;

    try {
      setLoading(true);
      const userId = participantInfo.userId;

      const response = await AuctionServices.getListAuctionDocumentRegisted({
        auctionId: selectedAuctionId,
        userId: userId,
      });

      if (response.code === 200 && response.data) {
        const participantDocuments = response.data.filter(
          (doc: AuctionDocument) =>
            doc.citizenIdentification === participantInfo.citizenIdentification
        );

        setDocuments(participantDocuments);
        calculateStatistics(participantDocuments);
      } else {
        message.warning(
          "Không tìm thấy dữ liệu đăng ký cho người tham gia này"
        );
        setDocuments([]);
        resetStatistics();
      }
    } catch (error) {
      console.error("Error fetching participant data:", error);
      message.error("Không thể tải thông tin đăng ký của người tham gia");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [
    selectedAuctionId,
    participantInfo?.citizenIdentification,
    participantInfo?.userId,
    calculateStatistics,
    resetStatistics,
  ]);

  // Handle auction selection
  const handleSelectAuction = useCallback((auctionId: string) => {
    setSelectedAuctionId(auctionId);
    setViewMode("detail");
  }, []);

  // Handle back to list
  const handleBackToList = useCallback(() => {
    setViewMode("list");
    setSelectedAuctionId(null);
    setDocuments([]);
    resetStatistics();
  }, [resetStatistics]);

  return {
    // State
    loading,
    registeredAuctions,
    documents,
    statistics,
    selectedAuctionId,
    viewMode,
    overallStatistics,

    // Actions
    fetchRegisteredAuctions,
    fetchParticipantData,
    calculateOverallStatistics,
    handleSelectAuction,
    handleBackToList,
  };
};
