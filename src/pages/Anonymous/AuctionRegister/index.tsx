import React, { useEffect, useState } from 'react';
import { Button, message, Steps, theme, Pagination } from 'antd';
import AssetSelect from './components/AssetSelect';
import type { AuctionDataDetail } from '../Modals';
import { useLocation } from 'react-router-dom';
import SepayComponent from '../../../components/Sepay';

const AuctionRegister = () => {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8; // 2 rows * 4 items per row
    const location = useLocation();
    const [auctionDetail, setAuctionDetail] = useState<AuctionDataDetail>(location.state.key);

    // Calculate items for current page
    const paginatedAssets = auctionDetail?.listAuctionAssets?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const steps = [
        {
            title: 'First',
            content: (
                <div>
                    <AssetSelect listAsset={paginatedAssets} />
                    {auctionDetail?.listAuctionAssets?.length > pageSize && (
                        <div className="mt-6 flex justify-center">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={auctionDetail?.listAuctionAssets?.length || 0}
                                onChange={(page) => setCurrentPage(page)}
                                showSizeChanger={false}
                                className="pagination-custom"
                            />
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Second',
            content: <SepayComponent />,
        },
        {
            title: 'Last',
            content: 'Last-content',
        },
    ];

    const next = () => {
        setCurrent(current + 1);
        setCurrentPage(1); // Reset page when moving to next step
    };

    const prev = () => {
        setCurrent(current - 1);
        setCurrentPage(1); // Reset page when moving to previous step
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const contentStyle = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
    };

    return (
        <section className="w-full min-h-screen flex flex-col">
            <style>
                {`
                    .pagination-custom .ant-pagination-item,
                    .pagination-custom .ant-pagination-prev,
                    .pagination-custom .ant-pagination-next {
                        border: none !important;
                        background: none !important;
                    }
                    .pagination-custom .ant-pagination-item a,
                    .pagination-custom .ant-pagination-prev button,
                    .pagination-custom .ant-pagination-next button {
                        color: #4b5563 !important; /* gray-600 */
                    }
                    .pagination-custom .ant-pagination-item-active a,
                    .pagination-custom .ant-pagination-item:hover a,
                    .pagination-custom .ant-pagination-prev:hover button,
                    .pagination-custom .ant-pagination-next:hover button {
                        color: #2563eb !important; /* blue-600 */
                    }
                    .pagination-custom .ant-pagination-item-active {
                        font-weight: 500;
                        background: none !important;
                        border: none !important;
                    }
                    .pagination-custom .ant-pagination-prev button,
                    .pagination-custom .ant-pagination-next button {
                        border: none !important;
                        background: none !important;
                    }
                `}
            </style>
            <div className=" bg-white shadow-md py-4">
                <div className="container mx-auto px-4">
                    <div className="w-1/2 mx-auto">
                        <Steps current={current} items={items} />
                    </div>
                </div>
            </div>
            <div className="flex-grow container mx-auto bg-white">
                {steps[current].content}
            </div>
            <div className="container mx-auto px-4 py-6">
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                        Done
                    </Button>
                )}
                {current > 0 && (
                    <Button className="ml-2" onClick={() => prev()}>
                        Previous
                    </Button>
                )}
            </div>
        </section>
    );
};

export default AuctionRegister;