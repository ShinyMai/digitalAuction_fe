import { useEffect, useState, useCallback } from "react";
import { Typography } from "antd";
import AuthServices from "../../../services/AuthServices";
import { toast } from "react-toastify";
import type { AccountData } from "./types";
import SearchFilter from "./components/SearchFilter";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeDetailModal from "./components/EmployeeDetailModal";
import { useCurrentUserInfo } from "../../../hooks/useUserInfo";

const { Title } = Typography;

const ListEmployee = () => {
  const { userInfo } = useCurrentUserInfo();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [roleId, setRoleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [listEmployee, setListEmployee] = useState<AccountData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<AccountData | null>(
    null
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const isDirector = userInfo?.roleName === "Director";

  const getViewableRoles = () => {
    if (isDirector) {
      return [
        { roleId: 3, roleName: "Nhân viên" },
        { roleId: 4, roleName: "Đấu giá viên" },
        { roleId: 5, roleName: "Giám đốc" },
        { roleId: 6, roleName: "Quản lý" },
      ];
    } else {
      return [
        { roleId: 3, roleName: "Nhân viên" },
        { roleId: 4, roleName: "Đấu giá viên" },
      ];
    }
  };

  const viewableRoles = getViewableRoles();
  const getListEmployee = useCallback(async () => {
    try {
      setLoading(true);
      const params: {
        PageNumber: number;
        PageSize: number;
        Search?: string;
        RoleId?: number;
      } = {
        PageNumber: pageNumber,
        PageSize: pageSize,
      };

      if (search && search.trim()) {
        params.Search = search.trim();
      }

      if (roleId !== null && roleId !== undefined) {
        params.RoleId = roleId;
      }

      const res = await AuthServices.getListAccount(params);
      if (res.code === 200) {
        let filteredEmployees = res.data.employeeAccounts;

        if (isDirector) {
          setListEmployee(filteredEmployees);
          setTotalCount(res.data.totalCount);
        } else {
          filteredEmployees = res.data.employeeAccounts.filter(
            (employee: AccountData) =>
              employee.roleName === "Staff" ||
              employee.roleName === "Auctioneer"
          );
          setListEmployee(filteredEmployees);
          setTotalCount(filteredEmployees.length);
        }
      } else {
        toast.error("Không thể tải danh sách nhân viên");
      }
    } catch (error) {
      console.error("Failed to fetch employee list:", error);
      toast.error("Lỗi khi tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, search, roleId, isDirector]);

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
    setRoleId(null);
    setPageNumber(1);
  };
  const getPageTitle = () => {
    return isDirector
      ? "Quản lý toàn bộ nhân viên"
      : "Danh sách nhân viên cấp dưới";
  };

  const getInfoMessage = () => {
    if (isDirector) {
      return "👑 Bạn có quyền xem thông tin của tất cả nhân viên trong hệ thống";
    } else {
      return "💼 Bạn chỉ có thể xem thông tin của nhân viên cấp dưới";
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Title level={3} className="!text-center !mb-4 !text-gray-800">
          {getPageTitle()}
        </Title>
        <div className="text-center mb-6">
          <p
            className={`text-sm px-4 py-2 rounded-lg inline-block border ${
              isDirector
                ? "text-purple-700 bg-purple-50 border-purple-200"
                : "text-gray-600 bg-blue-50 border-blue-200"
            }`}
          >
            {getInfoMessage()}
          </p>
        </div>
        {/* Search and Filter Section */}
        <SearchFilter
          search={search}
          setSearch={setSearch}
          roleId={roleId}
          setRoleId={setRoleId}
          roles={viewableRoles}
          onSearch={handleSearch}
          onReset={handleReset}
        />{" "}
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
