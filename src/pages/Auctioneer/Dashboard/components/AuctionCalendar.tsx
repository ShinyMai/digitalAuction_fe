import React from 'react';
import { Card, Calendar, Badge, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import type { BadgeProps } from 'antd';

const { Title } = Typography;

interface AuctionEvent {
    id: number;
    title: string;
    date: string;
    type: 'success' | 'processing' | 'warning';
}

const AuctionCalendar: React.FC = () => {
    // TODO: Replace with real data from API
    const auctionEvents: AuctionEvent[] = [
        {
            id: 1,
            title: 'Phiên đấu giá #123',
            date: '2025-07-24',
            type: 'success'
        },
        {
            id: 2,
            title: 'Phiên đấu giá #124',
            date: '2025-07-25',
            type: 'processing'
        },
        {
            id: 3,
            title: 'Phiên đấu giá #125',
            date: '2025-07-26',
            type: 'warning'
        }
    ];

    const dateCellRender = (date: Dayjs) => {
        const eventsOnDate = auctionEvents.filter(
            event => event.date === date.format('YYYY-MM-DD')
        );

        return (
            <ul className="events p-0">
                {eventsOnDate.map(event => (
                    <li key={event.id} className="list-none mb-1">
                        <Badge
                            status={event.type as BadgeProps['status']}
                            text={event.title}
                            className="text-xs"
                        />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <Card>
            <Title level={5} className="mb-4">Lịch đấu giá</Title>
            <Calendar
                fullscreen={false}
                cellRender={dateCellRender}
            />
        </Card>
    );
};

export default AuctionCalendar;
