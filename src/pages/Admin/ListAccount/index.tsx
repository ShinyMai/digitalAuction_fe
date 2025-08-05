import { useEffect, useState, useCallback } from "react";
import { Typography } from "antd";
import AuthServices from "../../../services/AuthServices";
import { toast } from "react-toastify";
import type { AccountData, Role } from "./types";
import SearchFilter from "./components/SearchFilter";
import AccountTable from "./components/AccountTable";
import AccountDetailModal from "./components/AccountDetailModal";

const { Title } = Typography;

const ListAccount = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [roleId, setRoleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [listAccount, setListAccount] = useState<AccountData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(
    null
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const getListAccount = useCallback(async () => {
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
        setListAccount(res.data.employeeAccounts);
        setTotalCount(res.data.totalCount);
      } else {
        toast.error("Không thể tải danh sách tài khoản");
      }
    } catch (error) {
      console.error("Failed to fetch account list:", error);
      toast.error("Lỗi khi tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, search, roleId]);

  const getRoles = async () => {
    try {
      const res = await AuthServices.getRole();
      if (res.code === 200) {
        setRoles(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  useEffect(() => {
    getListAccount();
  }, [getListAccount]);

  useEffect(() => {
    getRoles();
  }, []);

  const handleRowClick = (record: AccountData) => {
    setSelectedAccount(record);
    setDetailModalOpen(true);
  };

  const handleSearch = () => {
    setPageNumber(1);
    // getListAccount sẽ được gọi tự động do dependency trong useEffect
  };
  const handleReset = () => {
    setSearch("");
    setRoleId(null);
    setPageNumber(1);
    // getListAccount sẽ được gọi tự động do dependency trong useEffect
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Title level={3} className="!text-center !mb-8 !text-gray-800">
          Quản lý danh sách tài khoản nhân viên
        </Title>
        {/* Search and Filter Section */}
        <SearchFilter
          search={search}
          setSearch={setSearch}
          roleId={roleId}
          setRoleId={setRoleId}
          roles={roles}
          onSearch={handleSearch}
          onReset={handleReset}
        />
        {/* Table Section */}
        <AccountTable
          listAccount={listAccount}
          loading={loading}
          onRowClick={handleRowClick}
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(page, size) => {
            setPageNumber(page);
            setPageSize(size);
          }}
        />
        {/* Detail Modal */}
        <AccountDetailModal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          selectedAccount={selectedAccount}
        />
      </div>
    </div>
  );
};

export default ListAccount;
