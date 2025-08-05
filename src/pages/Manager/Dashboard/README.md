# Manager Dashboard - Mock Data & API Documentation

## 📋 Tổng quan

Manager Dashboard đã được hoàn thiện với các component sau:

### 🎯 **Components đã hoàn thành:**

- ✅ **BusinessOverview**: Tổng quan kinh doanh với 6 metrics chính
- ✅ **RevenueChart**: Biểu đồ Line + Column thực sự với @ant-design/plots
- ✅ **PerformanceAnalytics**: Phân tích hiệu suất với Pie chart
- ✅ **ApprovalManagement**: Quản lý phê duyệt với status tracking
- ✅ **ApprovalWorkflow**: Quy trình phê duyệt với workflow steps

### 🔧 **Technical Stack:**

- **React + TypeScript**: Type-safe component development
- **Ant Design**: UI components và styling
- **@ant-design/plots**: Biểu đồ thực sự (Line, Column, Pie charts)
- **Tailwind CSS**: Responsive design
- **Mock Data**: Dựa trên ModalsDatabase.ts structure

---

## 📊 **Files Structure**

```
src/pages/Manager/Dashboard/
├── index.tsx                    # Main dashboard page
├── components/
│   ├── BusinessOverview.tsx     # 6 business metrics cards
│   ├── RevenueChart.tsx         # Line & Column charts
│   ├── PerformanceAnalytics.tsx # Pie chart & staff performance
│   ├── ApprovalManagement.tsx   # Pending approvals list
│   └── ApprovalWorkflow.tsx     # Workflow steps tracking
└── mockData/
    ├── ManagerDashboardData.ts  # 📋 TẤT CẢ MOCK DATA
    └── ApiEndpointsGuide.ts     # 🔧 API IMPLEMENTATION GUIDE
```

---

## 🗂️ **Mock Data Summary**

### **1. Staff Performance Data**

```typescript
interface StaffPerformance {
  userId: string;
  name: string;
  role: string;
  efficiency: number; // (completed/total) * 100
  totalApprovals: number; // COUNT(approved documents)
  avgProcessingTime: number; // AVG(approval_time - create_time)
  customerSatisfaction: number; // AVG(feedback_rating)
  completedAuctions: number; // COUNT(DISTINCT auctions)
  processingDocuments: number; // COUNT(pending documents)
}
```

### **2. Monthly Revenue Data**

```typescript
interface MonthlyAuctionData {
  month: string; // T1, T2, T3...
  totalRevenue: number; // SUM(StartingPrice) in billions
  completedAuctions: number; // COUNT(Status = 1)
  totalParticipants: number; // COUNT(DISTINCT users)
  averageAssetValue: number; // AVG(StartingPrice)
}
```

### **3. Approval Items**

```typescript
interface ApprovalItem {
  auctionDocumentId: string; // From AuctionDocument
  auctionId: string;
  userId: string;
  userName: string;
  type: "auction" | "document" | "participant";
  statusTicket: number; // 0: Not Payment, 1: Success, 2: Cancelled
  statusDeposit: number; // 0: Not Payment, 1: Success
  urgency: "high" | "medium" | "low"; // Based on auction start date
  // ... other fields
}
```

### **4. Business Metrics**

```typescript
interface BusinessMetrics {
  totalAuctions: number; // COUNT(Auctions)
  totalRevenue: number; // SUM(StartingPrice)
  averageParticipants: number; // AVG(participants per auction)
  successRate: number; // (completed/total) * 100
  pendingApprovals: number; // COUNT(pending documents)
  approvalRate: number; // (approved/total) * 100
}
```

---

## 🔧 **API Implementation Guide**

### **Recommended Endpoints:**

1. **GET** `/api/manager/staff-performance`

   - **Query**: `startDate`, `endDate`, `departmentId?`
   - **Returns**: Array<StaffPerformance>

2. **GET** `/api/manager/monthly-revenue`

   - **Query**: `year?`, `months?`
   - **Returns**: Array<MonthlyAuctionData>

3. **GET** `/api/manager/pending-approvals`

   - **Query**: `limit?`, `urgency?`, `status?`
   - **Returns**: Array<ApprovalItem>

4. **GET** `/api/manager/business-metrics`

   - **Query**: `startDate?`, `endDate?`
   - **Returns**: BusinessMetrics

5. **GET** `/api/manager/workflow-steps`

   - **Returns**: Array<WorkflowStep>

6. **GET** `/api/manager/efficiency-distribution`
   - **Returns**: Array<{type, value, percent}>

### **SQL Calculation Examples:**

**Staff Efficiency:**

```sql
SELECT
  u.UserId,
  u.Name,
  ROUND(
    (COUNT(CASE WHEN ad.StatusTicket = 1 AND ad.StatusDeposit = 1 THEN 1 END) * 100.0) /
    COUNT(ad.AuctionDocumentId), 2
  ) as efficiency
FROM User u
LEFT JOIN AuctionDocument ad ON u.UserId = ad.UsserId
WHERE u.RoleId IN ('manager', 'staff')
GROUP BY u.UserId, u.Name;
```

**Monthly Revenue:**

```sql
SELECT
  FORMAT(a.AuctionEndDate, 'yyyy-MM') as month,
  SUM(aa.StartingPrice) as totalRevenue,
  COUNT(DISTINCT a.AuctionId) as completedAuctions
FROM Auctions a
INNER JOIN AuctionAsset aa ON a.AuctionId = aa.AuctionId
WHERE a.Status = 1
GROUP BY FORMAT(a.AuctionEndDate, 'yyyy-MM');
```

---

## 🎨 **UI Features**

### **Charts & Visualizations:**

- 📈 **Line Chart**: Revenue trend over time
- 📊 **Column Chart**: Monthly auction counts
- 🥧 **Pie Chart**: Staff efficiency distribution
- 📋 **Progress Bars**: KPI tracking
- 🏷️ **Status Tags**: Approval states
- 📱 **Responsive Design**: Mobile-friendly

### **Interactive Elements:**

- 📅 **Date Range Picker**: Filter by time period
- 🏢 **Department Filter**: Filter by department
- 🔄 **Real-time Updates**: Loading states
- 🎯 **Priority Indicators**: High/Medium/Low urgency
- 📊 **Workflow Visualization**: Step-by-step process tracking

---

## 🚀 **Integration Steps**

### **Phase 1: API Development**

1. Implement SQL queries từ `ApiEndpointsGuide.ts`
2. Create REST endpoints với error handling
3. Add authentication & authorization
4. Test với mock data

### **Phase 2: Frontend Integration**

1. Replace mock data với API calls
2. Add error handling & loading states
3. Implement real-time updates
4. Add caching strategy

### **Phase 3: Performance Optimization**

1. Add database indexing
2. Implement query optimization
3. Add response caching
4. Monitor performance metrics

---

## 📈 **Key Metrics Tracking**

### **Performance KPIs:**

- **Staff Efficiency**: 91.2% average
- **Processing Time**: 2.1 hours average
- **Customer Satisfaction**: 90.8% average
- **Approval Rate**: 94.2%

### **Business KPIs:**

- **Monthly Revenue**: 2.8B VNĐ current month
- **Success Rate**: 87.5%
- **Average Participants**: 24 per auction
- **Pending Approvals**: 12 items

### **Workflow KPIs:**

- **Submission**: 45 documents (0.5h avg)
- **Review**: 12 documents (2.1h avg)
- **Approval**: 8 documents (1.8h avg)
- **Publication**: 0 documents (0.3h avg)

---

## 🔄 **Update Strategy**

### **Real-time Updates:**

- Use WebSocket for approval notifications
- Polling for dashboard metrics every 5 minutes
- Cache strategy for performance data

### **Data Refresh:**

- **High frequency** (every minute): Pending approvals, workflow steps
- **Medium frequency** (every 5 minutes): Performance metrics, business KPIs
- **Low frequency** (every hour): Monthly revenue, efficiency distribution

---

## 📝 **Next Steps**

1. ✅ **COMPLETED**: Mock data structure và UI components
2. 🔄 **IN PROGRESS**: API endpoints implementation
3. ⏳ **PENDING**: Real-time data integration
4. ⏳ **PENDING**: Performance monitoring
5. ⏳ **PENDING**: User feedback system

---

**🎉 Manager Dashboard is ready for API integration!**

All components are fully functional with comprehensive mock data based on your database structure. The API guide provides detailed SQL queries and implementation examples for seamless backend integration.
