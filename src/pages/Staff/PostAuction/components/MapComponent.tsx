/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import { Input, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Định nghĩa kiểu cho dữ liệu từ Nominatim
interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: [string, string, string, string]; // [minLat, maxLat, minLon, maxLon]
}

// Định nghĩa props cho component
interface MapComponentProps {
  isSearchMode: boolean;
  defaultPosition?: [number, number];
  value?: string; // Giá trị form là display_name
  onChange?: (value: string) => void; // Truyền display_name ra form
  onPositionNameChange?: (name: string) => void;
  popupText?: string;
}

// Component để cập nhật trung tâm bản đồ
const MapUpdater: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom || map.getZoom());
  }, [center, zoom, map]);
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  isSearchMode,
  defaultPosition = [21.0285, 105.8542], // Default: Hà Nội
  value,
  onChange,
  onPositionNameChange,
  popupText = "Vị trí đấu giá",
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(value || "");
  const [position, setPosition] = useState<[number, number]>(defaultPosition);
  const [positionName, setPositionName] = useState<string>(value || "");
  const [boundingBox, setBoundingBox] = useState<[number, number, number, number] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputError, setInputError] = useState<boolean>(false);
  const prevValueRef = useRef<string | undefined>(value);

  // Hàm tính tâm và bán kính từ boundingbox
  const calculateCircle = (bbox: [number, number, number, number]): {
    center: [number, number];
    radius: number;
  } => {
    const [minLat, maxLat, minLon, maxLon] = bbox;
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;
    // Tính bán kính (khoảng cách từ tâm đến góc boundingbox, đơn vị mét)
    const latDiff = maxLat - minLat;
    const lonDiff = maxLon - minLon;
    const radius = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111_000 / 2; // Ước lượng mét
    return { center: [centerLat, centerLon], radius };
  };

  // Hàm gọi API Nominatim
  const fetchCoordinatesFromAddress = useCallback(
    async (address: string) => {
      if (!address.trim()) {
        setPosition(defaultPosition);
        setPositionName("");
        setSearchQuery("");
        setBoundingBox(null);
        onChange?.("");
        onPositionNameChange?.("");
        setInputError(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get<NominatimResult[]>(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: address,
              format: "json",
              limit: 1
            },
            headers: { "User-Agent": "AuctionApp/1.0" },
            maxRedirects: 5,
          }
        );

        if (response.data.length > 0) {
          const { lat, lon, display_name, boundingbox } = response.data[0];
          const newPosition: [number, number] = [parseFloat(lat), parseFloat(lon)];
          const newBoundingBox: [number, number, number, number] = [
            parseFloat(boundingbox[0]),
            parseFloat(boundingbox[1]),
            parseFloat(boundingbox[2]),
            parseFloat(boundingbox[3]),
          ];
          setPosition(newPosition);
          setPositionName(display_name);
          setSearchQuery(display_name);
          setBoundingBox(newBoundingBox);
          onChange?.(display_name);
          onPositionNameChange?.(display_name);
          console.log("Tên địa chỉ:", display_name); // In display_name ra console
          setInputError(false);
        } else {
          setInputError(true);
          setPosition(defaultPosition);
          setPositionName("");
          setSearchQuery(address);
          setBoundingBox(null);
          onChange?.("");
          onPositionNameChange?.("");
        }
      } catch (error) {
        console.error("Lỗi khi lấy tọa độ:", error);
        setInputError(true);
        setPosition(defaultPosition);
        setPositionName("");
        setSearchQuery(address);
        setBoundingBox(null);
        onChange?.("");
        onPositionNameChange?.("");
      } finally {
        setLoading(false);
      }
    },
    [defaultPosition, onChange, onPositionNameChange]
  );

  // Đồng bộ với value từ form
  useEffect(() => {
    if (value !== prevValueRef.current && value !== positionName) {
      fetchCoordinatesFromAddress(value || "");
      prevValueRef.current = value;
    }
  }, [value, fetchCoordinatesFromAddress, positionName]);

  // Hàm xử lý tìm kiếm
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setInputError(false);
      setPosition(defaultPosition);
      setPositionName("");
      setSearchQuery("");
      setBoundingBox(null);
      onChange?.("");
      onPositionNameChange?.("");
      return;
    }
    await fetchCoordinatesFromAddress(searchQuery);
  };

  // Xử lý nhấn Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {isSearchMode && (
        <Tooltip
          title={
            <span className="text-red-500">
              Không tìm thấy địa điểm! Hãy thử nhập lại (VD: Ninh Bình, Việt Nam)
            </span>
          }
          open={inputError}
          color="#fff"
        >
          <Input
            placeholder="Nhập tên địa điểm (VD: Ninh Bình, Việt Nam)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setInputError(false);
            }}
            onKeyPress={handleKeyPress}
            suffix={
              <SearchOutlined
                onClick={handleSearch}
                style={{ cursor: "pointer", color: loading ? "#d9d9d9" : "#1890ff" }}
              />
            }
            disabled={loading}
            style={{ marginBottom: "10px", borderColor: inputError ? "#ff4d4f" : undefined }}
            status={inputError ? "error" : undefined}
          />
        </Tooltip>
      )}
      <MapContainer center={position} zoom={10} style={{ height: "300px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater center={position} zoom={boundingBox ? 8 : 10} />
        {boundingBox && (
          <Circle
            center={calculateCircle(boundingBox).center}
            radius={calculateCircle(boundingBox).radius}
            pathOptions={{ color: "blue", fillOpacity: 0.2 }}
          >
            <Popup>
              {popupText} - {positionName || "Chưa xác định"}
            </Popup>
          </Circle>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;