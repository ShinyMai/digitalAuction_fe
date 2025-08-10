import { useEffect, useState, useCallback } from "react";
import { Typography } from "antd";
import { toast } from "react-toastify";
import type { AccountData, ListCustomerResponse } from "./types";
import SearchFilter from "./components/SearchFilter";
import EmployeeTable from "./components/CustomerTable";
import EmployeeDetailModal from "./components/CustomerDetailModal";
import UserServices from "../../../services/UserServices";

const { Title } = Typography;

const ListEmployee = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [listEmployee, setListEmployee] = useState<AccountData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<AccountData | null>(
    null
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const getListEmployee = useCallback(async () => {
    try {
      setLoading(true);
      const params: {
        PageNumber: number;
        PageSize: number;
        Search?: string;
      } = {
        PageNumber: pageNumber,
        PageSize: pageSize,
      };

      if (search && search.trim()) {
        params.Search = search.trim();
      }
      const res = await UserServices.getListCustomer(params);
      if (res.code === 200) {
        // Using the correct response structure based on API
        const responseData = res.data as ListCustomerResponse;
        const customers = responseData.customerInfos || [];

        setListEmployee(customers);
        setTotalCount(responseData.totalCount || customers.length);
      } else {
        toast.error("Không thể tải danh sách khách hàng");
      }
    } catch (error) {
      console.error("Failed to fetch customer list:", error);
      toast.error("Lỗi khi tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, search]);

  useEffect(() => {
    getListEmployee();
  }, [getListEmployee]);

  const handleRowClick = (record: AccountData) => {
    setSelectedEmployee(record);
    setDetailModalOpen(true);
  };

  const handleSearch = () => {
    setPageNumber(1);
    getListEmployee();
  };

  const handleReset = () => {
    setSearch("");
    setPageNumber(1);
  };
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Title level={3} className="!text-center !mb-4 !text-gray-800">
          Danh sách khách hàng
        </Title>
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg inline-block border border-blue-200">
            👥 Quản lý thông tin khách hàng tham gia đấu giá
          </p>
        </div>
        {/* Search and Filter Section */}
        <SearchFilter
          search={search}
          setSearch={setSearch}
          onSearch={handleSearch}
          onReset={handleReset}
        />
        {/* Employee Table Section */}
        <EmployeeTable
          listAccount={listEmployee}
          loading={loading}
          onRowClick={handleRowClick}
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(page: number, size: number) => {
            setPageNumber(page);
            setPageSize(size);
          }}
        />
        {/* Employee Detail Modal */}
        <EmployeeDetailModal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          selectedEmployee={selectedEmployee}
        />
      </div>
    </div>
  );
};

export default ListEmployee;
