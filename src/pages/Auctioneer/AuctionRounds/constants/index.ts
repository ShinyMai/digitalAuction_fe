export const ROUND_STATUS = {
  WAITING: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  CANCELLED: 3
} as const;

export const ROUND_STATUS_LABELS = {
  [ROUND_STATUS.WAITING]: 'Chờ bắt đầu',
  [ROUND_STATUS.IN_PROGRESS]: 'Đang diễn ra',
  [ROUND_STATUS.COMPLETED]: 'Đã hoàn thành',
  [ROUND_STATUS.CANCELLED]: 'Đã hủy'
} as const;

export const ROUND_STATUS_COLORS = {
  [ROUND_STATUS.WAITING]: 'default',
  [ROUND_STATUS.IN_PROGRESS]: 'processing',
  [ROUND_STATUS.COMPLETED]: 'success',
  [ROUND_STATUS.CANCELLED]: 'error'
} as const;

export const TIME_ALERT_THRESHOLDS = [
  300, // 5 minutes
  180, // 3 minutes
  60   // 1 minute
] as const;

export const PRICE_FORMAT_OPTIONS = {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
} as const;

export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const DATE_FORMAT = 'DD/MM/YYYY';
export const TIME_FORMAT = 'HH:mm:ss';

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZES = [10, 20, 50, 100];

export const WEBSOCKET_EVENTS = {
  NEW_BID: 'NEW_BID',
  TIME_UPDATE: 'TIME_UPDATE',
  ROUND_STATUS_CHANGE: 'ROUND_STATUS_CHANGE',
  PARTICIPANT_JOIN: 'PARTICIPANT_JOIN',
  PARTICIPANT_LEAVE: 'PARTICIPANT_LEAVE',
  ERROR: 'ERROR'
} as const;

export const EXPORT_FORMATS = {
  EXCEL: 'excel',
  PDF: 'pdf'
} as const;

// Validation constraints
export const VALIDATION = {
  MIN_DURATION: 5, // 5 phút
  MAX_DURATION: 120, // 120 phút
  MIN_PARTICIPANTS: 2,
  MIN_STEP_PRICE: 100000, // 100,000 VND
} as const;
