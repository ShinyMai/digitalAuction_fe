/**
 * MANAGER DASHBOARD MOCK DATA
 * ============================
 * 
 * File này chứa tất cả mock data được sử dụng trong Manager Dashboard
 * cùng với mô tả cách tính toán để hỗ trợ việc tạo API
 * 
 * Dựa trên structure từ ModalsDatabase.ts:
 * - User, Auctions, AuctionAsset, AuctionDocument, AuctionRound, AuctionRoundPrice
 */

// ==================== INTERFACES ====================

export interface StaffPerformance {
    userId: string;
    name: string;
    role: string;
    efficiency: number; // Calculated from completed tasks / total assigned tasks * 100
    totalApprovals: number; // Count of AuctionDocuments approved by this user
    avgProcessingTime: number; // Average time in hours from CreateAtTicket to approval
    customerSatisfaction: number; // Average rating from feedback
    completedAuctions: number; // Count of Auctions where this user was involved
    processingDocuments: number; // Count of AuctionDocuments currently being processed
}

export interface MonthlyAuctionData {
    month: string;
    totalRevenue: number; // Sum of all StartingPrice from AuctionAsset for auctions completed in this month
    completedAuctions: number; // Count of Auctions with Status = 1 completed in this month
    totalParticipants: number; // Count of unique UsserId from AuctionDocument for this month
    averageAssetValue: number; // Average StartingPrice of assets auctioned in this month
}

export interface ApprovalItem {
    auctionDocumentId: string; // From AuctionDocument.AuctionDocumentId
    auctionId: string; // From AuctionDocument.AuctionAssetId -> AuctionAsset.AuctionId  
    userId: string; // From AuctionDocument.UsserId
    userName: string; // From User.Name (join with userId)
    type: 'auction' | 'document' | 'participant';
    title: string; // Generated based on auction name or document type
    statusTicket: number; // From AuctionDocument.StatusTicket
    statusDeposit: number; // From AuctionDocument.StatusDeposit
    createAtTicket: string; // From AuctionDocument.CreateAtTicket
    createAtDeposit: string; // From AuctionDocument.CreateAtDeposit
    urgency: 'high' | 'medium' | 'low'; // Calculated based on auction start date proximity
    bankAccount: string; // From AuctionDocument.BankAccount
    numericalOrder: number; // From AuctionDocument.NumbericalOrder
}

export interface BusinessMetrics {
    totalAuctions: number; // Count of all Auctions
    totalRevenue: number; // Sum of all StartingPrice from AuctionAsset
    averageParticipants: number; // Average count of participants per auction
    successRate: number; // Percentage of auctions with Status = 1
    pendingApprovals: number; // Count of AuctionDocuments with StatusTicket = 0
    approvalRate: number; // Percentage of documents approved vs total submitted
}

export interface WorkflowStep {
    title: string;
    description: string;
    status: 'wait' | 'process' | 'finish' | 'error';
    count: number; // Count of items in this step
    avgTime: string; // Average processing time for this step
}

// ==================== MOCK DATA ====================

/**
 * STAFF PERFORMANCE DATA
 * =====================
 * 
 * API Calculation Logic:
 * - efficiency: (approved_documents / total_assigned_documents) * 100
 * - totalApprovals: COUNT(AuctionDocument WHERE approved_by = userId)
 * - avgProcessingTime: AVG(approval_time - CreateAtTicket) in hours
 * - customerSatisfaction: AVG(feedback_rating) from user feedback
 * - completedAuctions: COUNT(DISTINCT AuctionId WHERE user participated)
 * - processingDocuments: COUNT(AuctionDocument WHERE status IN [0,1] AND assigned_to = userId)
 */
export const mockStaffPerformance: StaffPerformance[] = [
    {
        userId: "user_001",
        name: 'Nguyễn Văn A',
        role: 'Quản lý cấp cao',
        efficiency: 95, // 38/40 tasks completed successfully
        totalApprovals: 28, // Approved 28 documents this month
        avgProcessingTime: 1.2, // Average 1.2 hours to process each document
        customerSatisfaction: 92, // 92% customer satisfaction rating
        completedAuctions: 15, // Participated in 15 completed auctions
        processingDocuments: 3 // Currently processing 3 documents
    },
    {
        userId: "user_002", 
        name: 'Trần Thị B',
        role: 'Chuyên viên phê duyệt',
        efficiency: 88, // 35/40 tasks completed successfully
        totalApprovals: 35, // Approved 35 documents this month
        avgProcessingTime: 1.8, // Average 1.8 hours to process each document
        customerSatisfaction: 89, // 89% customer satisfaction rating
        completedAuctions: 12, // Participated in 12 completed auctions
        processingDocuments: 5 // Currently processing 5 documents
    },
    {
        userId: "user_003",
        name: 'Lê Văn C', 
        role: 'Chuyên viên xem xét hồ sơ',
        efficiency: 91, // 36.4/40 tasks completed successfully
        totalApprovals: 31, // Approved 31 documents this month
        avgProcessingTime: 1.5, // Average 1.5 hours to process each document
        customerSatisfaction: 94, // 94% customer satisfaction rating
        completedAuctions: 18, // Participated in 18 completed auctions
        processingDocuments: 2 // Currently processing 2 documents
    }
];

/**
 * MONTHLY REVENUE DATA
 * ===================
 * 
 * API Calculation Logic:
 * - totalRevenue: SUM(AuctionAsset.StartingPrice) WHERE Auctions.AuctionEndDate BETWEEN month_start AND month_end
 * - completedAuctions: COUNT(Auctions) WHERE Status = 1 AND AuctionEndDate BETWEEN month_start AND month_end
 * - totalParticipants: COUNT(DISTINCT AuctionDocument.UsserId) WHERE CreateAtTicket BETWEEN month_start AND month_end
 * - averageAssetValue: AVG(AuctionAsset.StartingPrice) WHERE auction completed in this month
 */
export const mockMonthlyData: MonthlyAuctionData[] = [
    { 
        month: 'T1', 
        totalRevenue: 1.2, // 1.2 billion VND total revenue
        completedAuctions: 12, // 12 auctions completed
        totalParticipants: 240, // 240 unique participants
        averageAssetValue: 0.1 // 100 million VND average asset value
    },
    { 
        month: 'T2', 
        totalRevenue: 1.8, // 1.8 billion VND total revenue
        completedAuctions: 18, // 18 auctions completed
        totalParticipants: 320, // 320 unique participants
        averageAssetValue: 0.1 // 100 million VND average asset value
    },
    { 
        month: 'T3', 
        totalRevenue: 2.1, // 2.1 billion VND total revenue
        completedAuctions: 22, // 22 auctions completed
        totalParticipants: 380, // 380 unique participants
        averageAssetValue: 0.095 // 95 million VND average asset value
    },
    { 
        month: 'T4', 
        totalRevenue: 1.9, // 1.9 billion VND total revenue
        completedAuctions: 19, // 19 auctions completed
        totalParticipants: 310, // 310 unique participants
        averageAssetValue: 0.1 // 100 million VND average asset value
    },
    { 
        month: 'T5', 
        totalRevenue: 2.4, // 2.4 billion VND total revenue
        completedAuctions: 25, // 25 auctions completed
        totalParticipants: 420, // 420 unique participants
        averageAssetValue: 0.096 // 96 million VND average asset value
    },
    { 
        month: 'T6', 
        totalRevenue: 2.8, // 2.8 billion VND total revenue
        completedAuctions: 28, // 28 auctions completed
        totalParticipants: 480, // 480 unique participants
        averageAssetValue: 0.1 // 100 million VND average asset value
    }
];

/**
 * APPROVAL MANAGEMENT DATA
 * =======================
 * 
 * API Calculation Logic:
 * - Filter AuctionDocument WHERE StatusTicket IN [0,1] OR StatusDeposit = 0
 * - Join with User table to get userName
 * - Join with AuctionAsset -> Auctions to get auction details
 * - urgency calculated based on: if auction_start_date - now < 7 days then 'high', < 14 days then 'medium', else 'low'
 * - title generated from auction name and document type
 */
export const mockPendingApprovals: ApprovalItem[] = [
    {
        auctionDocumentId: 'doc_001',
        auctionId: 'auction_001',
        userId: 'user_001',
        userName: 'Nguyễn Văn A',
        type: 'auction',
        title: 'Phiên đấu giá tài sản BĐS Quận 1',
        statusTicket: 0, // Not Payment - needs approval
        statusDeposit: 0, // Not Payment
        createAtTicket: '2024-08-05T10:00:00Z',
        createAtDeposit: '2024-08-05T12:00:00Z',
        urgency: 'high', // Auction starts in < 7 days
        bankAccount: 'Vietcombank',
        numericalOrder: 1
    },
    {
        auctionDocumentId: 'doc_002',
        auctionId: 'auction_002', 
        userId: 'user_002',
        userName: 'Trần Thị B',
        type: 'document',
        title: 'Hồ sơ tham gia đấu giá - Công ty ABC',
        statusTicket: 1, // Payment successful
        statusDeposit: 0, // Not Payment - needs approval
        createAtTicket: '2024-08-05T08:00:00Z',
        createAtDeposit: '2024-08-05T14:00:00Z',
        urgency: 'medium', // Auction starts in 7-14 days
        bankAccount: 'BIDV',
        numericalOrder: 2
    },
    {
        auctionDocumentId: 'doc_003',
        auctionId: 'auction_003',
        userId: 'user_003', 
        userName: 'Lê Văn C',
        type: 'participant',
        title: 'Xác minh danh tính người tham gia',
        statusTicket: 1, // Payment successful
        statusDeposit: 1, // Payment successful - but needs identity verification
        createAtTicket: '2024-08-05T06:00:00Z',
        createAtDeposit: '2024-08-05T16:00:00Z',
        urgency: 'low', // Auction starts in > 14 days
        bankAccount: 'ACB',
        numericalOrder: 3
    }
];

/**
 * BUSINESS OVERVIEW METRICS
 * ========================
 * 
 * API Calculation Logic:
 * - totalAuctions: COUNT(Auctions)
 * - totalRevenue: SUM(AuctionAsset.StartingPrice)
 * - averageParticipants: AVG(participants_per_auction) from AuctionDocument grouped by AuctionId
 * - successRate: (COUNT(Auctions WHERE Status = 1) / COUNT(Auctions)) * 100
 * - pendingApprovals: COUNT(AuctionDocument WHERE StatusTicket = 0 OR StatusDeposit = 0)
 * - approvalRate: (COUNT(approved_documents) / COUNT(total_documents)) * 100
 */
export const mockBusinessMetrics: BusinessMetrics = {
    totalAuctions: 156, // Total auctions in system
    totalRevenue: 2450000000, // 2.45 billion VND total revenue
    averageParticipants: 24, // Average 24 participants per auction
    successRate: 87.5, // 87.5% success rate
    pendingApprovals: 12, // 12 documents pending approval
    approvalRate: 94.2 // 94.2% approval rate
};

/**
 * WORKFLOW STEPS DATA
 * ==================
 * 
 * API Calculation Logic:
 * - count: COUNT(AuctionDocument) in each step
 * - avgTime: AVG(time_diff) for each step based on status transitions
 * - status: determined by current bottlenecks and processing state
 */
export const mockWorkflowSteps: WorkflowStep[] = [
    {
        title: 'Nộp hồ sơ',
        description: 'Hồ sơ đã được nộp',
        status: 'finish', // No bottleneck, flowing well
        count: 45, // 45 documents submitted
        avgTime: '0.5h' // Average 30 minutes for submission
    },
    {
        title: 'Xem xét',
        description: 'Đang trong quá trình xem xét',
        status: 'process', // Currently being processed
        count: 12, // 12 documents under review
        avgTime: '2.1h' // Average 2.1 hours for review
    },
    {
        title: 'Phê duyệt',
        description: 'Chờ phê duyệt của quản lý',
        status: 'wait', // Waiting for manager approval
        count: 8, // 8 documents waiting for approval
        avgTime: '1.8h' // Average 1.8 hours for approval
    },
    {
        title: 'Công bố',
        description: 'Sẵn sàng đấu giá',
        status: 'wait', // Ready for publication
        count: 0, // No documents in publication queue
        avgTime: '0.3h' // Average 18 minutes for publication
    }
];

/**
 * EFFICIENCY DISTRIBUTION DATA
 * ============================
 * 
 * API Calculation Logic:
 * - Group staff by efficiency ranges
 * - Count staff in each range
 * - Calculate percentages
 */
export const mockEfficiencyDistribution = [
    { type: 'Xuất sắc (90%+)', value: 8, percent: 66.7 }, // 8 staff with 90%+ efficiency
    { type: 'Tốt (80-89%)', value: 3, percent: 25.0 }, // 3 staff with 80-89% efficiency
    { type: 'Cần cải thiện (<80%)', value: 1, percent: 8.3 } // 1 staff with <80% efficiency
];

/**
 * DEPARTMENT STATISTICS
 * ====================
 * 
 * API Calculation Logic:
 * - totalStaff: COUNT(User WHERE role IN manager_roles)
 * - activeStaff: COUNT(User WHERE last_login > 7_days_ago)
 * - avgEfficiency: AVG(staff_efficiency) from all staff
 * - avgSatisfaction: AVG(customer_satisfaction) from all staff
 */
export const mockDepartmentStats = {
    totalStaff: 12, // Total management staff
    activeStaff: 11, // Staff active in last 7 days
    avgEfficiency: 91.2, // Average team efficiency
    avgSatisfaction: 90.8 // Average customer satisfaction
};

/**
 * APPROVAL STATISTICS
 * ==================
 * 
 * API Calculation Logic:
 * - totalPending: COUNT(AuctionDocument WHERE StatusTicket = 0 OR StatusDeposit = 0)
 * - highPriority: COUNT(pending WHERE urgency = 'high')
 * - avgProcessingTime: AVG(processing_time) for completed approvals
 * - completionRate: (completed_this_week / total_this_week) * 100
 */
export const mockApprovalStats = {
    totalPending: 12, // Total pending approvals
    highPriority: 3, // High priority items
    avgProcessingTime: 2.5, // Average 2.5 hours processing time
    completionRate: 94.2 // 94.2% completion rate
};

// ==================== EXPORT ALL ====================
export const ManagerDashboardMockData = {
    staffPerformance: mockStaffPerformance,
    monthlyData: mockMonthlyData,
    pendingApprovals: mockPendingApprovals,
    businessMetrics: mockBusinessMetrics,
    workflowSteps: mockWorkflowSteps,
    efficiencyDistribution: mockEfficiencyDistribution,
    departmentStats: mockDepartmentStats,
    approvalStats: mockApprovalStats
};

export default ManagerDashboardMockData;
