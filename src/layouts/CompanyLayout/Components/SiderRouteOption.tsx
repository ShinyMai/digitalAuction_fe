import {
    BarChartOutlined,
    ScheduleOutlined,
    HomeOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Menu, type MenuProps } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const items: MenuProps['items'] = [
    {
        key: '1',
        icon: <BarChartOutlined />,
        label: 'Thống kê',
        url: '/statistics',
    },
    {
        key: '2',
        icon: <ScheduleOutlined />,
        label: 'Danh sách các buổi đấu giá',
        url: '/auctions',
    },
    {
        key: '3',
        icon: <HomeOutlined />,
        label: 'Danh sách bất động sản đấu giá',
        url: '/properties',
    },
    {
        key: '4',
        icon: <TeamOutlined />,
        label: 'Danh sách nhân lực',
        url: '/personnel',
    },
].map((item) => ({
    ...item,
    icon: React.createElement(item.icon.type),
}));

const SiderRouteOption = () => {
    const navigate = useNavigate();
    const onClick: MenuProps['onClick'] = (e) => {
        const item = items.find((i) => i?.key === e.key);
        if (item && 'url' in item) {
            navigate(`/admin/post-auction`);
        }
    };

    return (
        <div className="w-full h-full flex justify-center pt-6 bg-slate-50">
            <div className="w-full">
                <Menu
                    onClick={onClick}
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={items}
                    style={{ width: '100%', border: 'none', fontSize: '16px' }}
                    className="rounded-lg"

                />
            </div>
        </div>
    );
};

export default SiderRouteOption;