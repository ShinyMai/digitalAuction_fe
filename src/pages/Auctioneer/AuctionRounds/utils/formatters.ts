import { PRICE_FORMAT_OPTIONS, DATETIME_FORMAT, TIME_FORMAT, VALIDATION } from '../constants';
import type { ExtendedAuctionRound, CreateRoundFormData } from '../types';
import dayjs from 'dayjs';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', PRICE_FORMAT_OPTIONS).format(amount);
};

export const formatDateTime = (date: string): string => {
  return dayjs(date).format(DATETIME_FORMAT);
};

export const formatTime = (date: string): string => {
  return dayjs(date).format(TIME_FORMAT);
};

export const formatTimeRemaining = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateTimeLeft = (endTime: string): number => {
  const now = dayjs();
  const end = dayjs(endTime);
  return Math.max(0, end.diff(now, 'second'));
};

export const isValidPrice = (
  price: number,
  currentPrice: number,
  stepPrice: number
): boolean => {
  return price >= currentPrice + stepPrice;
};

export const validateRoundCreation = (values: CreateRoundFormData): string[] => {
  const errors: string[] = [];

  if (values.startTime.isBefore(dayjs())) {
    errors.push('Thời gian bắt đầu phải sau thời điểm hiện tại');
  }

  if (values.duration < VALIDATION.MIN_DURATION) {
    errors.push(`Thời gian diễn ra phải từ ${VALIDATION.MIN_DURATION} phút trở lên`);
  }

  if (values.duration > VALIDATION.MAX_DURATION) {
    errors.push(`Thời gian diễn ra không được vượt quá ${VALIDATION.MAX_DURATION} phút`);
  }

  if (values.startPrice <= 0) {
    errors.push('Giá khởi điểm phải lớn hơn 0');
  }

  if (values.stepPrice < VALIDATION.MIN_STEP_PRICE) {
    errors.push(`Bước giá phải từ ${formatCurrency(VALIDATION.MIN_STEP_PRICE)} trở lên`);
  }

  if (values.minParticipants < VALIDATION.MIN_PARTICIPANTS) {
    errors.push(`Số người tham gia tối thiểu phải từ ${VALIDATION.MIN_PARTICIPANTS} người trở lên`);
  }

  return errors;
};

export const generateExcelData = (rounds: ExtendedAuctionRound[]): Record<string, string | number>[] => {
  return rounds.map(round => ({
    'Vòng số': round.RoubdNumber,
    'Trạng thái': round.Status,
    'Giá khởi điểm': formatCurrency(round.startPrice),
    'Giá hiện tại': formatCurrency(round.currentPrice),
    'Số người tham gia': round.participantCount,
    'Thời gian bắt đầu': formatDateTime(round.CreatedAt),
    'Người tạo': round.CreatedBy
  }));
};

interface ChartDataPoint {
  time: string;
  price: number;
  participantCount: number;
}

interface ChartData {
  priceData: Array<{
    time: string;
    price: number;
  }>;
  participantData: Array<{
    time: string;
    count: number;
  }>;
}

export const preprocessChartData = (data: ChartDataPoint[]): ChartData => {
  return {
    priceData: data.map(item => ({
      time: formatTime(item.time),
      price: item.price
    })),
    participantData: data.map(item => ({
      time: formatTime(item.time),
      count: item.participantCount
    }))
  };
};
