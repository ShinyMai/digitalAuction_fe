import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { Input, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapComponentProps {
  isSearchMode: boolean;
  defaultPosition?: [number, number];
  value?: string; // Giá trị form sẽ là display_name
  onChange?: (value: string) => void; // Thay đổi type của onChange để nhận string
  onPositionNameChange?: (name: string) => void;
  name?: string;
  popupText?: string;
}

// Component để cập nhật trung tâm bản đồ
const MapUpdater: React.FC<{
  center: [number, number];
}> = ({ center }) => {
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
  onPositionNameChange,
  popupText = "Vị trí đấu giá",
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(
    value || ""
  );
  const [position, setPosition] =
    useState<[number, number]>(defaultPosition);
  const [positionName, setPositionName] = useState<string>(
    value || ""
  ); // Đồng bộ với value ban đầu
  const [loading, setLoading] = useState<boolean>(false);
  const [inputError, setInputError] =
    useState<boolean>(false);
  const prevValueRef = useRef<string | undefined>(value); // Theo dõi giá trị trước đó

  // Hàm chuyển đổi địa chỉ thành tọa độ
  const fetchCoordinatesFromAddress = useCallback(
    async (address: string) => {
      if (!address.trim()) {
        setPosition(defaultPosition);
        setPositionName("");
        setSearchQuery("");
        onPositionNameChange?.("");
        onChange?.("");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: address,
              format: "json",
              limit: 1,
            },
            headers: {
              "User-Agent": "AuctionApp/1.0",
            },
          }
        );

        if (response.data.length > 0) {
          const { lat, lon, display_name } =
            response.data[0];
          const newPosition: [number, number] = [
            parseFloat(lat),
            parseFloat(lon),
          ];
          if (
            newPosition[0] !== position[0] ||
            newPosition[1] !== position[1]
          ) {
            setPosition(newPosition);
            setPositionName(display_name);
            setSearchQuery(display_name); // Cập nhật ô input với display_name
            onChange?.(display_name); // Truyền display_name ra form
            onPositionNameChange?.(display_name);
          }
          setInputError(false);
        } else {
          setInputError(true);
          setPosition(defaultPosition);
          setPositionName("");
          setSearchQuery("");
          onPositionNameChange?.("");
          onChange?.("");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        setInputError(true);
        setPosition(defaultPosition);
        setPositionName("");
        setSearchQuery("");
        onPositionNameChange?.("");
        onChange?.("");
      } finally {
        setLoading(false);
      }
    },
    [
      defaultPosition,
      onChange,
      onPositionNameChange,
      position,
    ]
  );

  // Đồng bộ position với value từ Form, tránh vòng lặp
  useEffect(() => {
    if (value !== prevValueRef.current) {
      fetchCoordinatesFromAddress(value || "");
      prevValueRef.current = value; // Cập nhật giá trị trước đó
    }
  }, [value, fetchCoordinatesFromAddress]);

  // Hàm tìm kiếm tọa độ từ địa điểm sử dụng Nominatim API
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setInputError(false);
      return;
    }

    setLoading(true);
    setInputError(false);
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: searchQuery,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "AuctionApp/1.0",
          },
        }
      );

      if (response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        const newPosition: [number, number] = [
          parseFloat(lat),
          parseFloat(lon),
        ];
        if (
          newPosition[0] !== position[0] ||
          newPosition[1] !== position[1]
        ) {
          setPosition(newPosition);
          setPositionName(display_name);
          setSearchQuery(display_name); // Cập nhật ô input với display_name
          onChange?.(display_name); // Truyền display_name ra form
          onPositionNameChange?.(display_name);
        }
      } else {
        setInputError(true);
        onChange?.(positionName || "");
        setPositionName("");
        setSearchQuery("");
        onPositionNameChange?.("");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setInputError(true);
      onChange?.(positionName || "");
      setPositionName("");
      setSearchQuery("");
      onPositionNameChange?.("");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý nhấn Enter
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
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
              Không tìm thấy địa điểm! Hãy thử nhập đầy đủ
              (VD: Đường Nguyễn Văn Cừ, Hà Nội, Việt Nam)
            </span>
          }
          visible={inputError}
          color="#fff"
        >
          <Input
            placeholder="Nhập địa chỉ (VD: Đường Nguyễn Văn Cừ, Hà Nội, Việt Nam)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setInputError(false);
            }}
            onKeyPress={handleKeyPress}
            suffix={
              <SearchOutlined
                onClick={handleSearch}
                style={{
                  cursor: "pointer",
                  color: loading ? "#d9d9d9" : "#1890ff",
                }}
              />
            }
            disabled={loading}
            style={{
              marginBottom: "10px",
              borderColor: inputError
                ? "#ff4d4f"
                : undefined,
            }}
            status={inputError ? "error" : undefined}
          />
        </Tooltip>
      )}
      <MapContainer
        center={position}
        zoom={10}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater center={position} />
        <Marker position={position}>
          <Popup>
            {popupText} - {positionName || "Chưa xác định"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
