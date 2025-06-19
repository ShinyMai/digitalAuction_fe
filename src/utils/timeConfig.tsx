import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const vietnamTimeZone = "Asia/Ho_Chi_Minh";

export const convertToVietnamTime = (
  date: string | Date | undefined | null
): string => {
  if (!date) return "";
  return dayjs(date)
    .tz(vietnamTimeZone)
    .format("DD/MM/YYYY");
};
