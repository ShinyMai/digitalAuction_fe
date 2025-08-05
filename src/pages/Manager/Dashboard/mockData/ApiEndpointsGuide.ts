/**
 * MANAGER DASHBOARD API ENDPOINTS GUIDE
 * =====================================
 * 
 * Hướng dẫn tạo API endpoints cho Manager Dashboard
 * Dựa trên mock data và database structure từ ModalsDatabase.ts
 */

// ==================== API ENDPOINTS ====================

/**
 * 1. STAFF PERFORMANCE API
 * ========================
 * 
 * GET /api/manager/staff-performance
 * 
 * Query Parameters:
 * - startDate: string (ISO date)
 * - endDate: string (ISO date)
 * - departmentId?: string (optional filter)
 * 
 * SQL Query Logic:
 */
const staffPerformanceQuery = `
  SELECT 
    u.UserId,
    u.Name,
    u.Role,
    -- Efficiency: (completed tasks / total tasks) * 100
    ROUND(
      (COUNT(CASE WHEN ad.StatusTicket = 1 AND ad.StatusDeposit = 1 THEN 1 END) * 100.0) / 
      COUNT(ad.AuctionDocumentId), 2
    ) as efficiency,
    
    -- Total approvals this period
    COUNT(CASE WHEN ad.StatusTicket = 1 THEN 1 END) as totalApprovals,
    
    -- Average processing time in hours
    ROUND(
      AVG(DATEDIFF(hour, ad.CreateAtTicket, ad.UpdateAtTicket)), 2
    ) as avgProcessingTime,
    
    -- Customer satisfaction (would need additional feedback table)
    ISNULL(satisfaction.avg_rating, 0) as customerSatisfaction,
    
    -- Completed auctions user participated in
    COUNT(DISTINCT a.AuctionId) as completedAuctions,
    
    -- Currently processing documents
    COUNT(CASE WHEN ad.StatusTicket = 0 OR ad.StatusDeposit = 0 THEN 1 END) as processingDocuments
    
  FROM User u
  LEFT JOIN AuctionDocument ad ON u.UserId = ad.UsserId
  LEFT JOIN AuctionAsset aa ON ad.AuctionAssetId = aa.AssetId
  LEFT JOIN Auctions a ON aa.AuctionId = a.AuctionId
  LEFT JOIN (
    -- Subquery for satisfaction ratings (requires feedback table)
    SELECT UserId, AVG(rating) as avg_rating 
    FROM UserFeedback 
    GROUP BY UserId
  ) satisfaction ON u.UserId = satisfaction.UserId
  
  WHERE u.RoleId IN ('manager', 'staff', 'specialist')
    AND ad.CreateAtTicket BETWEEN @startDate AND @endDate
  
  GROUP BY u.UserId, u.Name, u.Role, satisfaction.avg_rating
  ORDER BY efficiency DESC;
`;

/**
 * 2. MONTHLY REVENUE DATA API
 * ===========================
 * 
 * GET /api/manager/monthly-revenue
 * 
 * Query Parameters:
 * - year: number (default current year)
 * - months?: number (number of months back, default 6)
 * 
 * SQL Query Logic:
 */
const monthlyRevenueQuery = `
  WITH MonthlyData AS (
    SELECT 
      FORMAT(a.AuctionEndDate, 'yyyy-MM') as month,
      SUM(aa.StartingPrice) as totalRevenue,
      COUNT(DISTINCT a.AuctionId) as completedAuctions,
      COUNT(DISTINCT ad.UsserId) as totalParticipants,
      ROUND(AVG(aa.StartingPrice), 2) as averageAssetValue
      
    FROM Auctions a
    INNER JOIN AuctionAsset aa ON a.AuctionId = aa.AuctionId
    LEFT JOIN AuctionDocument ad ON aa.AssetId = ad.AuctionAssetId
    
    WHERE a.Status = 1 -- Only completed auctions
      AND a.AuctionEndDate >= DATEADD(month, -@months, GETDATE())
      AND YEAR(a.AuctionEndDate) = @year
      
    GROUP BY FORMAT(a.AuctionEndDate, 'yyyy-MM')
  )
  
  SELECT 
    CASE 
      WHEN RIGHT(month, 2) = '01' THEN 'T1'
      WHEN RIGHT(month, 2) = '02' THEN 'T2'
      WHEN RIGHT(month, 2) = '03' THEN 'T3'
      WHEN RIGHT(month, 2) = '04' THEN 'T4'
      WHEN RIGHT(month, 2) = '05' THEN 'T5'
      WHEN RIGHT(month, 2) = '06' THEN 'T6'
      WHEN RIGHT(month, 2) = '07' THEN 'T7'
      WHEN RIGHT(month, 2) = '08' THEN 'T8'
      WHEN RIGHT(month, 2) = '09' THEN 'T9'
      WHEN RIGHT(month, 2) = '10' THEN 'T10'
      WHEN RIGHT(month, 2) = '11' THEN 'T11'
      WHEN RIGHT(month, 2) = '12' THEN 'T12'
    END as month,
    totalRevenue / 1000000000.0 as totalRevenue, -- Convert to billions
    completedAuctions,
    totalParticipants,
    averageAssetValue / 1000000000.0 as averageAssetValue -- Convert to billions
    
  FROM MonthlyData
  ORDER BY month;
`;

/**
 * 3. PENDING APPROVALS API
 * ========================
 * 
 * GET /api/manager/pending-approvals
 * 
 * Query Parameters:
 * - limit?: number (default 20)
 * - urgency?: 'high' | 'medium' | 'low'
 * - status?: 'pending' | 'processing'
 * 
 * SQL Query Logic:
 */
const pendingApprovalsQuery = `
  SELECT 
    ad.AuctionDocumentId,
    a.AuctionId,
    ad.UsserId as userId,
    u.Name as userName,
    
    -- Determine type based on document status
    CASE 
      WHEN ad.StatusTicket = 0 THEN 'document'
      WHEN ad.StatusDeposit = 0 THEN 'participant'
      ELSE 'auction'
    END as type,
    
    -- Generate title based on auction and type
    CASE 
      WHEN ad.StatusTicket = 0 THEN CONCAT('Phí tham gia - ', a.AuctionName)
      WHEN ad.StatusDeposit = 0 THEN CONCAT('Phí đặt cọc - ', a.AuctionName)
      ELSE a.AuctionName
    END as title,
    
    ad.StatusTicket,
    ad.StatusDeposit,
    ad.CreateAtTicket,
    ad.CreateAtDeposit,
    
    -- Calculate urgency based on auction start date
    CASE 
      WHEN DATEDIFF(day, GETDATE(), a.AuctionStartDate) <= 7 THEN 'high'
      WHEN DATEDIFF(day, GETDATE(), a.AuctionStartDate) <= 14 THEN 'medium'
      ELSE 'low'
    END as urgency,
    
    ad.BankAccount,
    ad.NumbericalOrder as numericalOrder
    
  FROM AuctionDocument ad
  INNER JOIN AuctionAsset aa ON ad.AuctionAssetId = aa.AssetId
  INNER JOIN Auctions a ON aa.AuctionId = a.AuctionId
  INNER JOIN User u ON ad.UsserId = u.UserId
  
  WHERE (ad.StatusTicket = 0 OR ad.StatusDeposit = 0)
    AND a.Status != 3 -- Not cancelled
    AND (@urgency IS NULL OR 
         CASE 
           WHEN DATEDIFF(day, GETDATE(), a.AuctionStartDate) <= 7 THEN 'high'
           WHEN DATEDIFF(day, GETDATE(), a.AuctionStartDate) <= 14 THEN 'medium'
           ELSE 'low'
         END = @urgency)
  
  ORDER BY 
    CASE urgency WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
    ad.CreateAtTicket ASC
    
  OFFSET 0 ROWS FETCH NEXT @limit ROWS ONLY;
`;

/**
 * 4. BUSINESS METRICS API
 * =======================
 * 
 * GET /api/manager/business-metrics
 * 
 * Query Parameters:
 * - startDate?: string (default: start of current month)
 * - endDate?: string (default: current date)
 * 
 * SQL Query Logic:
 */
const businessMetricsQuery = `
  SELECT 
    -- Total auctions in period
    (SELECT COUNT(*) FROM Auctions 
     WHERE CreatedAt BETWEEN @startDate AND @endDate) as totalAuctions,
    
    -- Total revenue from all assets
    (SELECT ISNULL(SUM(StartingPrice), 0) FROM AuctionAsset aa
     INNER JOIN Auctions a ON aa.AuctionId = a.AuctionId
     WHERE a.CreatedAt BETWEEN @startDate AND @endDate) as totalRevenue,
    
    -- Average participants per auction
    (SELECT ROUND(AVG(participants), 0) FROM (
       SELECT COUNT(DISTINCT ad.UsserId) as participants
       FROM AuctionDocument ad
       INNER JOIN AuctionAsset aa ON ad.AuctionAssetId = aa.AssetId
       INNER JOIN Auctions a ON aa.AuctionId = a.AuctionId
       WHERE a.CreatedAt BETWEEN @startDate AND @endDate
       GROUP BY a.AuctionId
     ) subq) as averageParticipants,
    
    -- Success rate (completed auctions / total auctions)
    ROUND(
      (SELECT COUNT(*) * 100.0 FROM Auctions 
       WHERE Status = 1 AND CreatedAt BETWEEN @startDate AND @endDate) /
      NULLIF((SELECT COUNT(*) FROM Auctions 
              WHERE CreatedAt BETWEEN @startDate AND @endDate), 0), 2
    ) as successRate,
    
    -- Pending approvals
    (SELECT COUNT(*) FROM AuctionDocument
     WHERE StatusTicket = 0 OR StatusDeposit = 0) as pendingApprovals,
    
    -- Approval rate
    ROUND(
      (SELECT COUNT(*) * 100.0 FROM AuctionDocument
       WHERE StatusTicket = 1 AND StatusDeposit = 1
       AND CreateAtTicket BETWEEN @startDate AND @endDate) /
      NULLIF((SELECT COUNT(*) FROM AuctionDocument
              WHERE CreateAtTicket BETWEEN @startDate AND @endDate), 0), 2
    ) as approvalRate;
`;

/**
 * 5. WORKFLOW STEPS API
 * =====================
 * 
 * GET /api/manager/workflow-steps
 * 
 * Returns current count and average processing time for each workflow step
 * 
 * SQL Query Logic:
 */
const workflowStepsQuery = `
  WITH WorkflowCounts AS (
    SELECT 
      -- Step 1: Submitted documents
      COUNT(CASE WHEN StatusTicket >= 0 THEN 1 END) as submitted_count,
      
      -- Step 2: Under review
      COUNT(CASE WHEN StatusTicket = 0 AND StatusDeposit = 0 THEN 1 END) as review_count,
      
      -- Step 3: Waiting for approval
      COUNT(CASE WHEN StatusTicket = 1 AND StatusDeposit = 0 THEN 1 END) as approval_count,
      
      -- Step 4: Ready for publication
      COUNT(CASE WHEN StatusTicket = 1 AND StatusDeposit = 1 THEN 1 END) as publication_count,
      
      -- Average processing times
      ROUND(AVG(CASE WHEN StatusTicket >= 0 
                THEN DATEDIFF(minute, CreateAtTicket, GETDATE()) / 60.0 END), 1) as avg_submission_time,
                
      ROUND(AVG(CASE WHEN StatusTicket = 1 
                THEN DATEDIFF(minute, CreateAtTicket, UpdateAtTicket) / 60.0 END), 1) as avg_review_time,
                
      ROUND(AVG(CASE WHEN StatusDeposit = 1 
                THEN DATEDIFF(minute, CreateAtDeposit, UpdateAtDeposit) / 60.0 END), 1) as avg_approval_time
                
    FROM AuctionDocument
    WHERE CreateAtTicket >= DATEADD(day, -30, GETDATE()) -- Last 30 days
  )
  
  SELECT 
    'Nộp hồ sơ' as title,
    'Hồ sơ đã được nộp' as description,
    CASE WHEN submitted_count > 50 THEN 'process' ELSE 'finish' END as status,
    submitted_count as count,
    CONCAT(ISNULL(avg_submission_time, 0.5), 'h') as avgTime
  FROM WorkflowCounts
  
  UNION ALL
  
  SELECT 
    'Xem xét' as title,
    'Đang trong quá trình xem xét' as description,
    CASE WHEN review_count > 15 THEN 'error' ELSE 'process' END as status,
    review_count as count,
    CONCAT(ISNULL(avg_review_time, 2.1), 'h') as avgTime
  FROM WorkflowCounts
  
  UNION ALL
  
  SELECT 
    'Phê duyệt' as title,
    'Chờ phê duyệt của quản lý' as description,
    CASE WHEN approval_count > 10 THEN 'error' ELSE 'wait' END as status,
    approval_count as count,
    CONCAT(ISNULL(avg_approval_time, 1.8), 'h') as avgTime
  FROM WorkflowCounts
  
  UNION ALL
  
  SELECT 
    'Công bố' as title,
    'Sẵn sàng đấu giá' as description,
    'wait' as status,
    publication_count as count,
    '0.3h' as avgTime
  FROM WorkflowCounts;
`;

/**
 * 6. EFFICIENCY DISTRIBUTION API
 * ==============================
 * 
 * GET /api/manager/efficiency-distribution
 * 
 * Returns distribution of staff efficiency levels
 * 
 * SQL Query Logic:
 */
const efficiencyDistributionQuery = `
  WITH StaffEfficiency AS (
    SELECT 
      u.UserId,
      u.Name,
      ROUND(
        (COUNT(CASE WHEN ad.StatusTicket = 1 AND ad.StatusDeposit = 1 THEN 1 END) * 100.0) / 
        NULLIF(COUNT(ad.AuctionDocumentId), 0), 2
      ) as efficiency
    FROM User u
    LEFT JOIN AuctionDocument ad ON u.UserId = ad.UsserId
    WHERE u.RoleId IN ('manager', 'staff', 'specialist')
      AND ad.CreateAtTicket >= DATEADD(month, -1, GETDATE())
    GROUP BY u.UserId, u.Name
  )
  
  SELECT 
    'Xuất sắc (90%+)' as type,
    COUNT(*) as value,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM StaffEfficiency), 1) as percent
  FROM StaffEfficiency
  WHERE efficiency >= 90
  
  UNION ALL
  
  SELECT 
    'Tốt (80-89%)' as type,
    COUNT(*) as value,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM StaffEfficiency), 1) as percent
  FROM StaffEfficiency
  WHERE efficiency >= 80 AND efficiency < 90
  
  UNION ALL
  
  SELECT 
    'Cần cải thiện (<80%)' as type,
    COUNT(*) as value,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM StaffEfficiency), 1) as percent
  FROM StaffEfficiency
  WHERE efficiency < 80;
`;

// ==================== RESPONSE INTERFACES ====================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

// ==================== ENDPOINT IMPLEMENTATIONS ====================

/**
 * Example Express.js route implementations
 */

/*
// 1. Staff Performance
app.get('/api/manager/staff-performance', async (req, res) => {
  try {
    const { startDate, endDate, departmentId } = req.query;
    const result = await db.query(staffPerformanceQuery, {
      startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: endDate || new Date(),
      departmentId
    });
    
    res.json({
      success: true,
      data: result.recordset,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch staff performance data'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// 2. Monthly Revenue
app.get('/api/manager/monthly-revenue', async (req, res) => {
  try {
    const { year = new Date().getFullYear(), months = 6 } = req.query;
    const result = await db.query(monthlyRevenueQuery, { year, months });
    
    res.json({
      success: true,
      data: result.recordset,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch monthly revenue data'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Similar implementations for other endpoints...
*/

export const ManagerDashboardApiGuide = {
  staffPerformanceQuery,
  monthlyRevenueQuery,
  pendingApprovalsQuery,
  businessMetricsQuery,
  workflowStepsQuery,
  efficiencyDistributionQuery
};
