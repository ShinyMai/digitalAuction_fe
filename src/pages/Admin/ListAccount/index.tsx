import { useEffect, useState, useCallback } from "react";
import { Typography } from "antd";
import AuthServices from "../../../services/AuthServices";
import { toast } from "react-toastify";
import type { AccountData } from "./types";
import SearchFilter from "./components/SearchFilter";
import AccountTable from "./components/AccountTable";
import AccountDetailModal from "./components/AccountDetailModal";
import AssignRoleModal from "./components/AssignRoleModal";

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
  const [assignRoleModalOpen, setAssignRoleModalOpen] = useState(false);
  const [accountForRoleAssign, setAccountForRoleAssign] =
    useState<AccountData | null>(null);

  const roles = [
    { roleId: 3, roleName: "Staff" },
    { roleId: 4, roleName: "Auctioneer" },
    { roleId: 5, roleName: "Director" },
    { roleId: 6, roleName: "Manager" },
  ];

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

  useEffect(() => {
    getListAccount();
  }, [getListAccount]);

  const handleRowClick = (record: AccountData) => {
    setSelectedAccount(record);
    setDetailModalOpen(true);
  };

  const handleSearch = () => {
    setPageNumber(1);
  };
  const handleReset = () => {
    setSearch("");
    setRoleId(null);
    setPageNumber(1);
  };
  const handleAssignRole = (record: AccountData) => {
    setAccountForRoleAssign(record);
    setAssignRoleModalOpen(true);
  };
  const handleRoleAssign = async (accountId: string, newRoleId: number) => {
    try {
      const res = await AuthServices.assignRole({
        accountId: accountId,
        roleId: newRoleId,
      });

      if (res.code === 200) {
        const selectedRole = roles.find((r) => r.roleId === newRoleId);
        toast.success(
          `Đã phân quyền "${selectedRole?.roleName}" thành công cho tài khoản!`
        );
        getListAccount();
      } else {
        toast.error("Không thể phân quyền tài khoản");
      }
    } catch (error) {
      console.error("Failed to assign role:", error);
      toast.error("Lỗi khi phân quyền tài khoản");
      throw error;
    }
  };

  const handleToggleStatus = (record: AccountData) => {
    const changeStatus = async () => {
      try {
        const res = await AuthServices.changeStatusAccount({
          accountId: record.accountId,
          isActive: !record.isActive,
        });
        if (res.code === 200) {
          toast.success(`Thay đổi trạng thái tài khoản: ${record.name}`);
        }
      } catch (error) {
        console.error("Failed to change account status:", error);
        toast.error("Lỗi khi thay đổi trạng thái tài khoản");
      } finally {
        getListAccount();
      }
    };
    changeStatus();
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
        />{" "}
        {/* Table Section */}
        <AccountTable
          listAccount={listAccount}
          loading={loading}
          onRowClick={handleRowClick}
          onAssignRole={handleAssignRole}
          onToggleStatus={handleToggleStatus}
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(page, size) => {
            setPageNumber(page);
            setPageSize(size);
          }}
        />{" "}
        {/* Detail Modal */}
        <AccountDetailModal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          selectedAccount={selectedAccount}
        />
        {/* Assign Role Modal */}
        <AssignRoleModal
          open={assignRoleModalOpen}
          onClose={() => {
            setAssignRoleModalOpen(false);
            setAccountForRoleAssign(null);
          }}
          selectedAccount={accountForRoleAssign}
          roles={roles}
          onAssign={handleRoleAssign}
        />
      </div>
    </div>
  );
};

export default ListAccount;
