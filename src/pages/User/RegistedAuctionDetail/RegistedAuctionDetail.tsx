import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Button, Empty, message, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import type { AuctionDocument } from "./types";
import AuctionServices from "../../../services/AuctionServices";
import {
  ApplicationsList,
  FilterSection,
  StatisticsOverview,
} from "./components";

const { Title } = Typography;

const RegistedAuctionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log("RegistedAuctionDetail ID:", id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<AuctionDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<AuctionDocument[]>(
    []
  );
  const [error, setError] = useState<string>("");
  const [depositFilter, setDepositFilter] = useState<number | "all">("all");
  const [ticketFilter, setTicketFilter] = useState<number | "all">("all");

  const fetchAuctionDetail = async () => {
    try {
      setLoading(true);
      const res = await AuctionServices.getListAuctionDocumentRegisted({
        auctionId: id,
      });

      if (res.code === 200) {
        setDocuments(res.data);
        setFilteredDocuments(res.data);
        setError("");
      } else {
        setError(res.message || "Có lỗi xảy ra khi tải dữ liệu");
      }
    } catch (err) {
      console.error("Error fetching user auction applications:", err);
      setError("Không thể tải danh sách đăng ký tham gia đấu giá");
      message.error("Có lỗi xảy ra khi tải danh sách đăng ký");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchAuctionDetail();
    } else {
      setError("ID phiên đấu giá không hợp lệ");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Filter effect
  useEffect(() => {
    let filtered = documents;

    if (depositFilter !== "all") {
      filtered = filtered.filter((doc) => doc.statusDeposit === depositFilter);
    }

    if (ticketFilter !== "all") {
      filtered = filtered.filter((doc) => doc.statusTicket === ticketFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, depositFilter, ticketFilter]);

  // Calculate statistics based on filtered data
  const statistics = {
    totalDocuments: filteredDocuments.length,
    totalDeposit: filteredDocuments.reduce((sum, doc) => sum + doc.deposit, 0),
    totalRegistrationFee: filteredDocuments.reduce(
      (sum, doc) => sum + doc.registrationFee,
      0
    ),
    paidDeposits: filteredDocuments.filter((doc) => doc.statusDeposit === 1)
      .length,
    pendingDeposits: filteredDocuments.filter((doc) => doc.statusDeposit === 0)
      .length,
    refundedDeposits: filteredDocuments.filter((doc) => doc.statusDeposit === 2)
      .length,
    approvedTickets: filteredDocuments.filter((doc) => doc.statusTicket === 1)
      .length,
    pendingTickets: filteredDocuments.filter((doc) => doc.statusTicket === 0)
      .length,
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" tip="Đang tải thông tin chi tiết..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/registed-auction")}
          style={{ marginBottom: "16px !important" }}
        >
          Quay lại danh sách đấu giá
        </Button>
        <Empty description={error} style={{ margin: "50px 0" }}>
          <div className="text-center p-4">
            Không thể tải thông tin chi tiết phiên đấu giá
          </div>
          <Button type="primary" onClick={fetchAuctionDetail}>
            Thử lại
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="max-w-11/12 mx-auto">
      <div className="mb-6">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/registed-auction")}
          className="!p-0 !text-lg !text-blue-600 hover:!text-blue-700 my-5"
        >
          Quay lại danh sách đấu giá
        </Button>
        <Title level={2}>Danh sách tài sản đã đăng ký tham gia đấu giá</Title>
      </div>

      <FilterSection
        depositFilter={depositFilter}
        ticketFilter={ticketFilter}
        setDepositFilter={setDepositFilter}
        setTicketFilter={setTicketFilter}
        filteredCount={filteredDocuments.length}
        totalCount={documents.length}
      />

      {/* Statistics Overview Component */}
      <StatisticsOverview statistics={statistics} />

      {/* Applications List Component */}
      <ApplicationsList
        filteredDocuments={filteredDocuments}
        documents={documents}
        auctionId={id || ""}
      />
    </div>
  );
};

export default RegistedAuctionDetail;
