/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback } from "react";

export interface MinimalBid {
  tagName?: string;
  auctionAssetName?: string;
  auctionPrice?: number;
  price?: number;
  startingPrice?: number;
  citizenIdentification?: string;
  userName?: string;
  auctionRoundPriceId?: string;
}

export interface MinimalAsset {
  tagName?: string;
  name?: string;
  assetName?: string;
  startingPrice?: number;
}

interface Params<
  Row extends MinimalBid = MinimalBid,
  Asset extends MinimalAsset = MinimalAsset
> {
  auctionRound?: any; // có priceMin, priceMax, auctionAssets
  priceHistory?: Row[]; // dữ liệu lịch sử (nếu có)
  assets?: Asset[]; // suy ra startingPrice theo tagName
}

const toPosNumber = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

const getName = (r: any) => r?.auctionAssetName ?? r?.tagName;

export default function useAuctionRoundAnalysis<
  Row extends MinimalBid = MinimalBid,
  Asset extends MinimalAsset = MinimalAsset
>({ auctionRound, priceHistory = [], assets = [] }: Params<Row, Asset>) {
  // Map startingPrice theo tagName (ưu tiên assets trong round)
  const startingPriceByTagName = useMemo(() => {
    const map = new Map<string, number>();

    const roundAssets: any[] = (auctionRound as any)?.auctionAssets;
    if (Array.isArray(roundAssets)) {
      for (const a of roundAssets) {
        const key = a?.tagName ?? a?.name ?? a?.assetName;
        const sp = Number(a?.startingPrice);
        if (key && Number.isFinite(sp) && sp > 0) map.set(String(key), sp);
      }
    }

    for (const a of assets) {
      const key = a?.tagName ?? a?.name ?? a?.assetName;
      const sp = Number(a?.startingPrice);
      if (key && Number.isFinite(sp) && sp > 0 && !map.has(String(key))) {
        map.set(String(key), sp);
      }
    }

    // fallback từ history nếu chưa có
    for (const bid of priceHistory as any[]) {
      const key = getName(bid);
      const sp = Number(bid?.startingPrice);
      if (key && Number.isFinite(sp) && sp > 0 && !map.has(String(key))) {
        map.set(String(key), sp);
      }
    }

    return map;
  }, [auctionRound, assets, priceHistory]);

  const getStartPriceForRow = useCallback(
    (row: Row): number | undefined => {
      const direct = Number((row as any)?.startingPrice);
      if (Number.isFinite(direct) && direct > 0) return direct;

      const key = getName(row);
      if (!key) return undefined;

      const sp = startingPriceByTagName.get(String(key));
      return typeof sp === "number" ? sp : undefined;
    },
    [startingPriceByTagName]
  );

  const computeValidity = useCallback(
    (row: Row) => {
      const reasons: string[] = [];

      const stepMin = toPosNumber((auctionRound as any)?.priceMin);
      // priceMax chỉ dùng để tính NGƯỠNG TỐI ĐA = startingPrice + priceMax
      const priceMax = toPosNumber((auctionRound as any)?.priceMax);

      const rawPrice = (row as any)?.auctionPrice ?? (row as any)?.price;
      const price = Number(rawPrice) || 0;

      // (1) Giá khởi điểm
      const startMaybe = getStartPriceForRow(row);
      if (startMaybe === undefined) {
        // Không xác định được startingPrice -> không thể kiểm tra giới hạn tối đa hay bước giá
        return {
          valid: reasons.length === 0,
          reasons,
          reason: reasons[0],
        } as const;
      }
      const start = startMaybe;

      // (1.1) Kiểm tra nhỏ hơn giá khởi điểm
      if (price < start) {
        reasons.push("Nhỏ hơn giá khởi điểm");
        return { valid: false, reasons, reason: reasons[0] } as const;
      }

      // (2) Giới hạn tối đa = startingPrice + priceMax (nếu có priceMax)
      if (priceMax !== undefined) {
        const limitMax = start + priceMax;
        if (price > limitMax) {
          reasons.push(
            `Vượt giá tối đa ${limitMax.toLocaleString("vi-VN")} VND`
          );
        }
      }

      const delta = price - start;

      // (3) Cho phép = đúng giá khởi điểm
      if (delta === 0) {
        return {
          valid: reasons.length === 0,
          reasons,
          reason: reasons[0],
        } as const;
      }

      // (4) Bước giá:
      // - KHÔNG còn logic kiểm tra theo priceMax
      // - Nếu có priceMin: delta phải ≥ priceMin và là bội số của priceMin
      if (stepMin === undefined) {
        // Không cấu hình priceMin -> không kiểm tra bước giá
        return {
          valid: reasons.length === 0,
          reasons,
          reason: reasons[0],
        } as const;
      }

      if (delta < stepMin) {
        reasons.push(
          `Nhỏ hơn bước giá tối thiểu (${stepMin.toLocaleString("vi-VN")} VND)`
        );
      }

      if (delta % stepMin !== 0) {
        reasons.push(
          `Sai bước giá (bội số của ${stepMin.toLocaleString("vi-VN")} VND)`
        );
      }

      return {
        valid: reasons.length === 0,
        reasons,
        reason: reasons[0],
      } as const;
    },
    [auctionRound, getStartPriceForRow]
  );

  const isValidBid = useCallback(
    (row: Row) => computeValidity(row).valid,
    [computeValidity]
  );

  // Lịch sử hợp lệ (dùng cho bảng lịch sử/ phân tích)
  const validPriceHistory = useMemo(
    () => (priceHistory ?? []).filter((r) => isValidBid(r)),
    [priceHistory, isValidBid]
  );

  // Highest bidders cho 1 tài sản (tính trên dữ liệu hợp lệ)
  const getHighestBiddersForAsset = useCallback(
    (assetName: string) => {
      const list = validPriceHistory.filter(
        (b: any) => getName(b) === assetName
      );
      if (!list.length) return [] as Row[];
      const maxPrice = Math.max(
        ...list.map((b: any) => Number(b?.auctionPrice ?? b?.price) || 0)
      );
      return list.filter(
        (b: any) => Number(b?.auctionPrice ?? b?.price) === maxPrice
      ) as Row[];
    },
    [validPriceHistory]
  );

  // Phân tích theo tài sản (tính trên dữ liệu hợp lệ)
  const getAssetAnalysis = useCallback(() => {
    const assetNames = Array.from(
      new Set(validPriceHistory.map((b: any) => getName(b)).filter(Boolean))
    );

    return assetNames
      .map((name) => {
        const bids = validPriceHistory.filter((b: any) => getName(b) === name);
        const prices = bids.map(
          (b: any) => Number(b?.auctionPrice ?? b?.price) || 0
        );
        const highest = Math.max(...prices);
        const lowest = Math.min(...prices);
        const avg = prices.reduce((s, p) => s + p, 0) / prices.length;
        const uniq = new Set(bids.map((b: any) => b?.citizenIdentification))
          .size;
        const topCnt = bids.filter(
          (b: any) => (Number(b?.auctionPrice ?? b?.price) || 0) === highest
        ).length;

        let competition: "Thấp" | "Trung bình" | "Cao" | "Rất cao" = "Thấp";
        if (uniq >= 20) competition = "Rất cao";
        else if (uniq >= 15) competition = "Cao";
        else if (uniq >= 10) competition = "Trung bình";

        return {
          tagName: name as string,
          totalBidders: uniq,
          uniqueBidders: uniq,
          highestPrice: highest,
          highestPriceBidders: topCnt,
          totalBids: bids.length,
          averagePrice: avg,
          priceRange: highest - lowest,
          lowestPrice: lowest,
          competitionLevel: competition,
        };
      })
      .sort((a, b) => b.highestPrice - a.highestPrice);
  }, [validPriceHistory]);

  return {
    // validate
    computeValidity,
    isValidBid,
    getStartPriceForRow,

    // dữ liệu đã lọc
    validPriceHistory,

    // phân tích
    getAssetAnalysis,
    getHighestBiddersForAsset,
  } as const;
}
