export type Roles = {
    RoleId: string;
    RoleName: string; // e.g., "admin", "manager", "staff", "auctioneer", "cusstomer", "director" 
}

export type AuctionCategory = {
    CategoryId: string;
    CategoryName: string;
}

export type User = {
    UserId: string;
    Name: string;
    CitizenIdentification: string;
    Birthday: string;
    Nationality: string;
    Gender: string;
    ValidDate: string;
    OriginLocation: string;
    RecentLocation: string;
    IssueDate: string;
    IssueBy: string;
    CreatedAt: string;
    CreatedBy: string;
    UpdatedAt: string;
    UpdatedBy: string;
}   

export type Auctions = {
    AuctionId: string;
    AuctionName: string;
    AuctionDescription: string;
    AuctionRules: string;
    AuctionPlanningMap: string;
    RegisterOpenDate: string;
    RegisterEndDate: string;
    AuctionStartDate: string;
    AuctionEndDate: string;
    AuctionMap: string;
    CreatedAt: string;
    CreatedBy: string;
    UpdatedAt: string;
    UpdatedBy: string;
    QRLink: string;
    NumberRoundMax: number;
    Status: number; // 0: Draff, 1: Public, 3: Cancelled
    WinnerData: string;
    CategoryId: string;
    AuctioneersId: string; // UserId of auctioneer
    CancelReason: string;
    CancelReasonFile: string
}

export type AuctionAsset = {
    AssetId: string;
    TagName: string;
    StartingPrice: number;
    Unit: string;
    DepositPrice: number;
    RegistrationFee: number;
    Description: string;
    CreatedAt: string;
    CreatedBy: string;
    UpdatedAt: string;
    UpdatedBy: string;
    AuctionId: string; // AuctionId of the auction this asset belongs to
}

export type AuctionDocument = {
    AuctionDocumentId: string;
    UsserId: string; // UserId of the user who uploaded the document
    AuctionAssetId: string; // AssetId of the asset this document belongs to
    BankAccount: string;
    BankAccountNumber: string;
    BankBranch: string;
    CreateByTicket: string;
    CreateAtTicket: string;
    UpdateAtTicket: string;
    CreateAtDeposit: string;
    StatusTicket: number; // 0: Not Payment, 1: Payment successfull, 2: Cancelled
    StatusDeposit: number; // 0: Not Payment, 1: Payment successfull
    NumbericalOrder: number;
    Note: string;
}

export type AuctionRound = {
    AuctionRoundId: string;
    AuctionId: string; // AuctionId of the auction this round belongs to
    RoubdNumber: number; // Round number in the auction
    Status: number;
    CreatedAt: string;
    CreatedBy: string;
}

export type AuctionRoundPrice = {
    AuctionRoundPriceId: string;
    AuctionRoundId: string; // AuctionRoundId of the round this price belongs to
    UserName: string; // Name of the user who placed the bid
    CitezenIdentification: string; // Citizen ID of the user who placed the bid
    RecentLocation: string; // Recent location of the user
    TagName: string; // Tag name of the asset being bid on
    AuctionPrice: number; // Price of the bid
    CreatedAt: string; // Timestamp of when the bid was placed
    CreatedBy: string; // UserId of the user who placed the bid
}

export type BlackList = {
    BlackListId: string;
    UserId: string; // UserId of the user in the blacklist
    Reason: string; // Reason for being blacklisted
    AccountId: string; // AccountId of the user in the blacklist
    CreatedAt: string; // Timestamp of when the user was blacklisted
    CreatedBy: string; // UserId of the user who created the blacklist entry
}

export type Infomations = {
    InformationId: string;
    CompanyName: string; // Name of the company
    TaxCode: string; // Tax code of the company
    Address: string; // Address of the company
    Phone: string; // Phone number of the company
    Description: string; // Description of the company
    Logo: string; // Logo of the company
    CreatedAt: string; // Timestamp of when the information was created
    CreatedBy: string; // UserId of the user who created the information
    UpdatedAt: string; // Timestamp of when the information was last updated
    UpdatedBy: string; // UserId of the user who last updated the information
}

export type Noctification = {
    NotificationId: string;
    UserId: string; // UserId of the user who receives the notification
    Message: string; // Content of the notification
    NotificationType: string; // Type of notification (e.g., "auction", "system")
    SentAt: string; // Timestamp of when the notification was sent
    IsRead: boolean; // Whether the notification has been read
    UpdatedAt: string; // Timestamp of when the notification was last updated
    UrlAuction: string; // URL to the auction related to the notification
}

export type Account = {
    BlogTypeId: string;
    BlogsName: string; // Name of the account holder
}

export type Blogs = {
    BlogId: string;
    Title: string; // Title of the blog
    Content: string; // Content of the blog
    ThumbnailUrl: string; // Thumbnail image of the blog
    CreatedAt: string; // Timestamp of when the blog was created
    CreatedBy: string; // UserId of the user who created the blog
    UpdatedAt: string; // Timestamp of when the blog was last updated
    UpdatedBy: string; // UserId of the user who last updated the blog
    Status: number; 
    BlogTypeId: string;
}

