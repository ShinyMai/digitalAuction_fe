/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback } from "react";
import type { AuctionRoundPrice } from "../pages/Auctioneer/Modals";
import type { AuctionRound } from "../pages/Auctioneer/AuctionRoundDetail/modalsData";

// Kiểu dữ liệu phân tích (giữ nguyên như bạn đang dùng)
export interface AssetAnalysis {
  tagName: string;
  totalBidders: number;
  uniqueBidders: number;
  highestPrice: number;
  highestPriceBidders: number;
  totalBids: number;
  averagePrice: number;
  priceRange: number;
  lowestPrice: number;
  competitionLevel: "Thấp" | "Trung bình" | "Cao" | "Rất cao";
}

export interface ValidityResult {
  valid: boolean;
  reasons: string[];
}

interface UseAuctionRoundAnalysisParams {
  auctionRound?: AuctionRound;
  priceHistory: AuctionRoundPrice[];
  /** Nếu muốn yêu cầu bắt buộc có startingPrice (mặc định: false) */
  requireStartingPrice?: boolean;
}

export function useAuctionRoundAnalysis({
  auctionRound,
  priceHistory,
  requireStartingPrice = false,
}: UseAuctionRoundAnalysisParams) {
  const toPosNumber = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };

  // Map startingPrice theo tagName (ưu tiên từ auctionRound.auctionAssets, fallback từ priceHistory)
  const startingPriceByTagName = useMemo(() => {
    const map = new Map<string, number>();

    const assets: any[] = (auctionRound as any)?.auctionAssets;
    if (Array.isArray(assets)) {
      for (const a of assets) {
        const sp = Number(a?.startingPrice);
        const key = a?.tagName ?? a?.name ?? a?.assetName;
        if (key && Number.isFinite(sp)) map.set(String(key), sp);
      }
    }

    for (const bid of priceHistory as any[]) {
      const key = bid?.tagName;
      const sp = Number(bid?.startingPrice);
      if (key && Number.isFinite(sp) && !map.has(String(key))) {
        map.set(String(key), sp);
      }
    }

    return map;
  }, [auctionRound, priceHistory]);

  const validateBid = useCallback(
    (bid: AuctionRoundPrice): ValidityResult => {
      const reasons: string[] = [];

      const stepMin = toPosNumber((auctionRound as any)?.priceMin);
      const stepMax = toPosNumber((auctionRound as any)?.priceMax);
      const totalMax = toPosNumber((auctionRound as any)?.totalPriceMax);
      const limitMax = Number.isFinite(totalMax as number)
        ? (totalMax as number)
        : Infinity;

      const price = Number(bid.auctionPrice) || 0;

      // Trần giá
      if (price > limitMax) {
        reasons.push(`Vượt giá tối đa ${limitMax.toLocaleString("vi-VN")} VND`);
      }

      // starting price theo asset
      const startFromMap = startingPriceByTagName.get(bid.tagName);
      const start = Number.isFinite(startFromMap as number)
        ? (startFromMap as number)
        : undefined;

      if (start === undefined) {
        if (requireStartingPrice) {
          reasons.push("Không xác định được giá khởi điểm");
          return { valid: false, reasons };
        }
        // không yêu cầu: chỉ check trần
        return { valid: reasons.length === 0, reasons };
      }

      // cho phép = giá khởi điểm
      if (price === start) {
        return { valid: reasons.length === 0, reasons };
      }

      // < giá khởi điểm
      if (price < start) {
        reasons.push("Nhỏ hơn giá khởi điểm");
        return { valid: false, reasons };
      }

      // > khởi điểm: delta phải chia hết cho priceMin HOẶC priceMax (nếu có)
      const delta = price - start;

      if (stepMin === undefined && stepMax === undefined) {
        return { valid: reasons.length === 0, reasons };
      }

      let divisibleOK = false;
      if (stepMin !== undefined && delta % stepMin === 0) divisibleOK = true;
      if (stepMax !== undefined && delta % stepMax === 0) divisibleOK = true;

      if (!divisibleOK) {
        const parts: string[] = [];
        if (stepMin !== undefined) parts.push(stepMin.toLocaleString("vi-VN"));
        if (stepMax !== undefined) parts.push(stepMax.toLocaleString("vi-VN"));
        reasons.push(`Sai bước giá`);
      }

      return { valid: reasons.length === 0, reasons };
    },
    [auctionRound, startingPriceByTagName, requireStartingPrice]
  );

  const isValidBid = useCallback(
    (bid: AuctionRoundPrice) => validateBid(bid).valid,
    [validateBid]
  );

  const validPriceHistory = useMemo(
    () => priceHistory.filter(isValidBid),
    [priceHistory, isValidBid]
  );

  const getHighestBiddersForAsset = useCallback(
    (assetName: string) => {
      const assetBids = validPriceHistory.filter(
        (b) => b.tagName === assetName
      );
      if (assetBids.length === 0) return [] as AuctionRoundPrice[];
      const maxPrice = Math.max(...assetBids.map((b) => b.auctionPrice));
      return assetBids.filter((b) => b.auctionPrice === maxPrice);
    },
    [validPriceHistory]
  );

  const assetAnalyses = useMemo<AssetAnalysis[]>(() => {
    const assets = [...new Set(validPriceHistory.map((b) => b.tagName))];

    return assets
      .map((assetName) => {
        const assetBids = validPriceHistory.filter(
          (b) => b.tagName === assetName
        );
        const prices = assetBids.map((b) => b.auctionPrice);
        const uniqueBidders = new Set(
          assetBids.map((b) => b.citizenIdentification)
        );

        const highestPrice = Math.max(...prices);
        const lowestPrice = Math.min(...prices);
        const averagePrice = prices.reduce((s, p) => s + p, 0) / prices.length;
        const highestPriceBidders = assetBids.filter(
          (b) => b.auctionPrice === highestPrice
        ).length;

        let competitionLevel: AssetAnalysis["competitionLevel"] = "Thấp";
        if (uniqueBidders.size >= 20) competitionLevel = "Rất cao";
        else if (uniqueBidders.size >= 15) competitionLevel = "Cao";
        else if (uniqueBidders.size >= 10) competitionLevel = "Trung bình";

        return {
          tagName: assetName,
          totalBidders: uniqueBidders.size,
          uniqueBidders: uniqueBidders.size,
          highestPrice,
          highestPriceBidders,
          totalBids: assetBids.length,
          averagePrice,
          priceRange: highestPrice - lowestPrice,
          lowestPrice,
          competitionLevel,
        };
      })
      .sort((a, b) => b.highestPrice - a.highestPrice);
  }, [validPriceHistory]);

  return {
    // maps & helpers
    startingPriceByTagName,
    validateBid,
    isValidBid,

    // data đã lọc + API phân tích
    validPriceHistory,
    getHighestBiddersForAsset,
    assetAnalyses,
  };
}
