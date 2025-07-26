/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { message } from 'antd';
import { mockRounds, mockStats } from './data/mockData';
import type { ExtendedAuctionRound, RoundStatss } from './types';
import RoundList from './components/RoundList';
import AuctionRoundStats from './components/RoundStats';

/**
 * API Endpoints Documentation
 * 
 * 1. GET /api/auctions/{auctionId}/rounds
 * Purpose: Lấy danh sách các vòng đấu giá và thống kê của một phiên đấu giá
 * Parameters:
 *   - auctionId: string (path parameter) - ID của phiên đấu giá
 * Response: {
 *   rounds: ExtendedAuctionRound[];
 *   stats: RoundStats;
 * }
 * 
 * 2. POST /api/auctions/{auctionId}/rounds
 * Purpose: Tạo một vòng đấu giá mới
 * Parameters:
 *   - auctionId: string (path parameter)
 * Request Body: {
 *   startTime: string (ISO date string);
 *   duration: number (minutes);
 *   startPrice: number;
 *   stepPrice: number;
 *   minParticipants: number;
 * }
 * Response: {
 *   round: ExtendedAuctionRound;
 * }
 * 
 * 3. GET /api/auctions/rounds/{roundId}
 * Purpose: Lấy chi tiết một vòng đấu giá
 * Parameters:
 *   - roundId: string (path parameter)
 * Response: {
 *   round: ExtendedAuctionRound;
 * }
 * 
 * 4. POST /api/auctions/rounds/{roundId}/start
 * Purpose: Bắt đầu một vòng đấu giá
 * Parameters:
 *   - roundId: string (path parameter)
 * Response: {
 *   round: ExtendedAuctionRound;
 * }
 * 
 * 5. POST /api/auctions/rounds/{roundId}/end
 * Purpose: Kết thúc một vòng đấu giá
 * Parameters:
 *   - roundId: string (path parameter)
 * Response: {
 *   round: ExtendedAuctionRound;
 * }
 * 
 * Special Notes for ModalsDatabase.ts Updates:
 * 1. Thêm các trường sau vào interface AuctionRound:
 *    - startPrice: number - Giá khởi điểm của vòng
 *    - stepPrice: number - Bước giá tối thiểu
 *    - minParticipants: number - Số người tham gia tối thiểu
 *    - remainingTime?: number - Thời gian còn lại (seconds)
 * 
 * 2. Thêm trường mới vào AuctionRoundPrice:
 *    - bidTime: string - Thời điểm trả giá
 *    - bidAmount: number - Số tiền trả
 */


const AuctionRounds = () => {
    //const { id: auctionId } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [rounds, setRounds] = useState<ExtendedAuctionRound[]>([]);
    const [stats, setStats] = useState<RoundStatss | null>(null);

    useEffect(() => {
        // Trong môi trường thực tế, thay thế bằng API call
        setRounds(mockRounds);
        setStats(mockStats);
    }, []);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            // TODO: Implement API call to refresh data
            message.success('Đã cập nhật dữ liệu');
        } catch {
            message.error('Không thể cập nhật dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleStartRound = async (roundId: string) => {
        try {
            setLoading(true);
            // TODO: Implement API call to start round
            console.log('Starting round:', roundId);
            message.success('Đã bắt đầu vòng đấu giá');
        } catch {
            message.error('Không thể bắt đầu vòng đấu giá');
        } finally {
            setLoading(false);
        }
    };

    const handleEndRound = async (roundId: string) => {
        try {
            setLoading(true);
            // TODO: Implement API call to end round
            console.log('Ending round:', roundId);
            message.success('Đã kết thúc vòng đấu giá');
        } catch {
            message.error('Không thể kết thúc vòng đấu giá');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-fit bg-gradient-to-br">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Stats */}
                {stats && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                        <AuctionRoundStats stats={stats} loading={loading} />
                    </div>
                )}

                {/* Round List */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                    <RoundList
                        rounds={rounds}
                        loading={loading}
                        onRefresh={handleRefresh}
                        onStartRound={handleStartRound}
                        onEndRound={handleEndRound}
                    />
                </div>
            </div>
        </div>
    );
};

export default AuctionRounds;
