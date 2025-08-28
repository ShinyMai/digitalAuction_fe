// src/hooks/useAuctionRoundAnalysis.ts
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
  auctionRound?: any; // có priceMin, priceMax, totalPriceMax, auctionAssets
  priceHistory?: Row[]; // dữ liệu lịch sử (nếu có)
  assets?: Asset[]; // suy ra startingPrice theo tagName
  // otherBids?: Row[];      // KHÔNG còn dùng, có thể giữ trong interface nếu muốn backward-compatible
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
      const stepMax = toPosNumber((auctionRound as any)?.priceMax);
      // const totalMax = toPosNumber((auctionRound as any)?.totalPriceMax);
      const totalMax = stepMax && row?.startingPrice ? stepMax + row?.startingPrice : 0;
      const limitMax = Number.isFinite(totalMax as number)
        ? (totalMax as number)
        : Infinity;

      const rawPrice = (row as any)?.auctionPrice ?? (row as any)?.price;
      const price = Number(rawPrice) || 0;

      // (0) Chỉ giới hạn bởi totalPriceMax
      if (price > limitMax) {
        reasons.push(`Vượt giá tối đa ${limitMax.toLocaleString("vi-VN")} VND`);
      }

      // (1) Giá khởi điểm
      const startMaybe = getStartPriceForRow(row);
      if (startMaybe === undefined) {
        return {
          valid: reasons.length === 0,
          reasons,
          reason: reasons[0],
        } as const;
      }
      const start = startMaybe;

      if (price < start) {
        reasons.push("Nhỏ hơn giá khởi điểm");
        return { valid: false, reasons, reason: reasons[0] } as const;
      }

      const delta = price - start;

      // (2) Cho phép = đúng giá khởi điểm
      if (delta === 0) {
        return {
          valid: reasons.length === 0,
          reasons,
          reason: reasons[0],
        } as const;
      }

      // (3) Bước giá:
      // - KHÔNG chặn bởi priceMax
      // - Nếu có stepMin: delta phải ≥ stepMin
      // - Hợp lệ nếu delta là bội số của stepMin HOẶC bội số của stepMax
      if (stepMin === undefined && stepMax === undefined) {
        // Không cấu hình bước giá -> chỉ bị ràng buộc bởi totalPriceMax
        return {
          valid: reasons.length === 0,
          reasons,
          reason: reasons[0],
        } as const;
      }

      // Nếu có stepMin, delta phải >= stepMin (thông lệ nghiệp vụ)
      if (stepMin !== undefined && delta < stepMin) {
        reasons.push(
          `Nhỏ hơn bước giá tối thiểu (${stepMin.toLocaleString("vi-VN")} VND)`
        );
      }

      let multipleOk = false;
      if (stepMin !== undefined && delta % stepMin === 0) multipleOk = true; // bội số priceMin
      if (!multipleOk && stepMax !== undefined && delta % stepMax === 0)
        multipleOk = true; // bội số priceMax

      if (!multipleOk) {
        const parts: string[] = [];
        if (stepMin !== undefined)
          parts.push(`bội số của ${stepMin.toLocaleString("vi-VN")} VND`);
        if (stepMax !== undefined)
          parts.push(`bội số của ${stepMax.toLocaleString("vi-VN")} VND`);
        reasons.push(`Sai bước giá (${parts.join(" hoặc ")})`);
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
