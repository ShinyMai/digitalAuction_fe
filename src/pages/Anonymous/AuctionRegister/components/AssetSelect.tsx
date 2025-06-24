import React, { useState } from 'react';
import { Card, Tooltip } from 'antd';
import { CheckCircleFilled, AppstoreOutlined, TagOutlined, ApartmentOutlined, FileTextOutlined, DollarOutlined, WalletOutlined, CreditCardOutlined } from '@ant-design/icons';

interface Props {
    listAsset?: DataType[];
}

interface DataType {
    auctionAssetsId: string;
    tagName: string;
    startingPrice: string;
    unit: string;
    deposit: string;
    registrationFee: string;
    description?: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    auctionId: string;
    auction?: string;
    imageUrl?: string;
}

const formatVND = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

const AssetSelect = ({ listAsset }: Props) => {
    const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

    const handleCardClick = (assetId: string) => {
        if (selectedAssets.includes(assetId)) {
            setSelectedAssets(selectedAssets.filter((id) => id !== assetId));
        } else {
            setSelectedAssets([...selectedAssets, assetId]);
        }
    };

    const truncateDescription = (text?: string, maxLength: number = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    return (
        <div className="w-full h-full pt-10 px-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {listAsset?.map((item: DataType, index) => (
                    <Card
                        key={index}
                        className={`shadow-md hover:shadow-lg hover:!bg-gray-100 hover:!border-blue-200 transition-all cursor-pointer ${selectedAssets.includes(item.auctionAssetsId)
                                ? '!border-2 !border-blue-600'
                                : '!border !border-gray-200'
                            } !bg-white`}
                        onClick={() => handleCardClick(item.auctionAssetsId)}
                        bordered={false}
                    >
                        <div className="relative">
                            {/* Phần trên: Ảnh tài sản */}
                            <div className="w-full h-48 bg-white flex items-center justify-center overflow-hidden rounded-t-lg">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.tagName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-200">
                                        <AppstoreOutlined className="text-4xl" />
                                    </div>
                                )}
                            </div>
                            {/* Dấu tích khi được chọn */}
                            {selectedAssets.includes(item.auctionAssetsId) && (
                                <div className="text-blue-600">
                                    <CheckCircleFilled
                                        className="absolute top-2 right-2 text-xl"
                                        style={{ background: 'white', borderRadius: '50%', padding: '2px' }}
                                    />
                                </div>
                            )}
                        </div>
                        {/* Phần dưới: Thông tin tài sản */}
                        <div className="p-4 text-sm grid grid-cols-2 gap-4">
                            {/* Bên trái: tagName, unit, description */}
                            <div className="space-y-2 flex flex-col">
                                <div className="flex items-center gap-2 text-gray-800">
                                    <div className="text-blue-600">
                                        <TagOutlined />
                                    </div>
                                    {item.tagName}
                                </div>
                                <div className="flex items-center gap-2 text-gray-800">
                                    <div className="text-blue-600">
                                        <ApartmentOutlined />
                                    </div>
                                    {item.unit}
                                </div>
                                {item.description && (
                                    <Tooltip title={item.description} placement="top" color="gray-800">
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                                            <div className="text-blue-600">
                                                <FileTextOutlined />
                                            </div>
                                            {truncateDescription(item.description)}
                                        </div>
                                    </Tooltip>
                                )}
                            </div>
                            {/* Bên phải: startingPrice, deposit, registrationFee */}
                            <div className="space-y-2 flex flex-col">
                                <div className="flex items-center gap-2 text-gray-800">
                                    <div className="text-blue-600">
                                        <DollarOutlined />
                                    </div>
                                    {formatVND(item.startingPrice)}
                                </div>
                                <div className="flex items-center gap-2 text-gray-800">
                                    <div className="text-blue-600">
                                        <WalletOutlined />
                                    </div>
                                    {formatVND(item.deposit)}
                                </div>
                                <div className="flex items-center gap-2 text-gray-800">
                                    <div className="text-blue-600">
                                        <CreditCardOutlined />
                                    </div>
                                    {formatVND(item.registrationFee)}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AssetSelect;