export interface AccountData {
  accountId: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  roleId: number;
  roleName: string;
  userId: string;
  citizenIdentification: string;
  name: string;
  birthDay: string;
  nationality: string;
  gender: boolean;
  validDate: string;
  originLocation: string;
  recentLocation: string;
  issueDate: string;
  issueBy: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Role {
  roleId: number;
  roleName: string;
}
