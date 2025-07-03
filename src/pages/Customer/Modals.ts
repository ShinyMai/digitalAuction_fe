export type AuctionCategory = {
  categoryId: number;
  categoryName: string;
};

export type AuctionDataList = {
    auctionId: string;
    auctionName: string;
    categoryId: number;
    registerOpenDate: string;
    registerEndDate: string;
    auctionStartDate: string;
    auctionEndDate: string;
    createdByUserName: string;
}

export type AuctionDataDetail = {
    id: string;
    auctionName: string;
    categoryName: string;
    auctionDescription: string;
    auctionRules: string;
    auctionPlanningMap: string;
    registerOpenDate: string;
    registerEndDate: string;
    auctionStartDate: string;
    auctionEndDate: string;
    createdByUserName: string;
    createdAt: string;
    updatedByUserName: string;
    updatedAt: string;
    qrLink: string;
    numberRoundMax: number;
    status: string;
    winnerData: string;
    listAuctionAssets: AuctionAsset[] | [];
}

export type AuctionAsset = {
  auctionAssetsId: string;
  tagName: string;
  startingPrice: string;
  unit: string;
  deposit: string;
  registrationFee:string;
  description?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  auctionId: string;
  auction?: string;
}

export type auctionDocument = {
  auctionAssetsId: string[],
  bankAccount: string; // tên loại ngân hàng
  bankAccountNubmer: string;
  bankBranch: string;
  // tiền chuyển.
}

export type dataPayment = {
  qrUrl: string,
  accountNumber: string;
  beneficiaryBank: string;
  amountTicket: number;
  description: string;
}

export type UserInfomation = {
  name: string;
  birthDay: string;
  citizenIdentification: string;
  issueDate: string;
  issueBy: string;
  phoneNumber: string;
  originLocation: string;
}

export type RegistrationAuctionModals = {
    fullName?: string;
    dob?: string;
    idNumber?: string;
    idDate?: string;
    place?: string;
    phone?: string;
    address?: string;
    auctionInfo?: string;
    assetsInfo?: string;
    priceStart?: string;
    bankAccount?: string;
    bankAccountNumber?: string;
    bankBranch?: string;
    locationDate?: string;
}