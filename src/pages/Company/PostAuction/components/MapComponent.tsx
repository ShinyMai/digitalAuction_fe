import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Input, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapComponentProps {
    isSearchMode: boolean;
    defaultPosition?: [number, number];
    value?: string; // Chỉ chấp nhận chuỗi
    onChange?: (value: [number, number]) => void;
    name?: string;
    popupText?: string;
}

// Component để cập nhật trung tâm bản đồ
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
    isSearchMode,
    defaultPosition = [21.0285, 105.8542], // Default: Hà Nội
    value,
    onChange,
    name,
    popupText = 'Vị trí đấu giá',
}) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [position, setPosition] = useState<[number, number]>(defaultPosition);
    const [loading, setLoading] = useState<boolean>(false);
    const [inputError, setInputError] = useState<boolean>(false);

    // Hàm chuyển đổi địa chỉ thành tọa độ
    const fetchCoordinatesFromAddress = async (address: string) => {
        if (!address.trim()) return;
        setLoading(true);
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: address,
                    format: 'json',
                    limit: 1,
                },
                headers: {
                    'User-Agent': 'AuctionApp/1.0',
                },
            });

            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                const newPosition: [number, number] = [parseFloat(lat), parseFloat(lon)];
                setPosition(newPosition);
                onChange?.(newPosition);
                setInputError(false);
            } else {
                setInputError(true);
                onChange?.(defaultPosition); // Quay về vị trí mặc định nếu không tìm thấy
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            setInputError(true);
            onChange?.(defaultPosition); // Quay về vị trí mặc định nếu có lỗi
        } finally {
            setLoading(false);
        }
    };

    // Đồng bộ position với value từ Form
    useEffect(() => {
        if (value) {
            fetchCoordinatesFromAddress(value);
        } else {
            setPosition(defaultPosition);
        }
    }, [value, defaultPosition]);

    // Hàm tìm kiếm tọa độ từ địa điểm sử dụng Nominatim API
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setInputError(false);
            return;
        }

        setLoading(true);
        setInputError(false); // Reset trạng thái lỗi trước khi tìm kiếm
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: searchQuery,
                    format: 'json',
                    limit: 1,
                },
                headers: {
                    'User-Agent': 'AuctionApp/1.0', // Thêm User-Agent theo yêu cầu Nominatim
                },
            });

            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                const newPosition: [number, number] = [parseFloat(lat), parseFloat(lon)];
                setPosition(newPosition); // Cập nhật vị trí marker
                onChange?.(newPosition); // Cập nhật giá trị cho Form
            } else {
                setInputError(true); // Đặt trạng thái lỗi để hiển thị tooltip
                onChange?.(position); // Giữ nguyên giá trị hiện tại trong form
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            setInputError(true); // Đặt trạng thái lỗi
            onChange?.(position); // Giữ nguyên giá trị hiện tại trong form
        } finally {
            setLoading(false);
        }
    };

    // Xử lý nhấn Enter
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {isSearchMode && (
                <Tooltip
                    title={<span className="text-red-500">Không tìm thấy địa điểm! Hãy thử nhập đầy đủ (VD: Đường Nguyễn Văn Cừ, Hà Nội, Việt Nam)</span>}
                    visible={inputError}
                    color="#fff"
                >
                    <Input
                        placeholder="Nhập địa chỉ (VD: Đường Nguyễn Văn Cừ, Hà Nội, Việt Nam)"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setInputError(false); // Reset trạng thái lỗi khi người dùng nhập lại
                        }}
                        onKeyPress={handleKeyPress}
                        suffix={
                            <SearchOutlined
                                onClick={handleSearch}
                                style={{ cursor: 'pointer', color: loading ? '#d9d9d9' : '#1890ff' }}
                            />
                        }
                        disabled={loading}
                        style={{ marginBottom: '10px', borderColor: inputError ? '#ff4d4f' : undefined }}
                        status={inputError ? 'error' : undefined}
                    />
                </Tooltip>
            )}
            <MapContainer
                center={position}
                zoom={10}
                style={{ height: '300px', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={position} />
                <Marker position={position}>
                    <Popup>{popupText}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapComponent;