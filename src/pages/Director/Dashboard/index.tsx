import React, { useState, useEffect } from 'react';
import { Space, Typography, DatePicker, Select } from 'antd';
import {
    LineChartOutlined
} from '@ant-design/icons';
import ExecutiveSummary from './components/ExecutiveSummary';
import type { RangePickerProps } from 'antd/es/date-picker';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface DateRange {
    startDate: string;
    endDate: string;
}

const DirectorDashboard: React.FC = () => {
    const [dateRange, setDateRange] = useState<DateRange | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string>('all');
    const [loading, setLoading] = useState(false);

    // TODO: Fetch data from APIs
    useEffect(() => {
        fetchExecutiveData();
    }, [dateRange, selectedRegion]);

    const fetchExecutiveData = async () => {
        setLoading(true);
        try {
            // Call APIs here
        } catch (error) {
            console.error('Error fetching executive data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
        if (dates && dateStrings[0] && dateStrings[1]) {
            setDateRange({
                startDate: dateStrings[0],
                endDate: dateStrings[1]
            });
        } else {
            setDateRange(null);
        }
    };

    return (
        <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
            {/* Executive Header */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Title level={1} className="!mb-2 !text-gray-800">
                            <LineChartOutlined className="!mr-3 !text-blue-600" />
                            Executive Dashboard
                        </Title>
                        <p className="!text-lg !text-gray-600 !mb-0">
                            Strategic insights và business intelligence
                        </p>
                    </div>

                    {/* Executive Filters */}
                    <Space size="middle" wrap>
                        <RangePicker
                            onChange={handleDateRangeChange}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            size="large"
                        />
                        <Select
                            value={selectedRegion}
                            onChange={setSelectedRegion}
                            size="large"
                            style={{ width: 200 }}
                            options={[
                                { label: 'Toàn quốc', value: 'all' },
                                { label: 'Miền Bắc', value: 'north' },
                                { label: 'Miền Trung', value: 'central' },
                                { label: 'Miền Nam', value: 'south' }
                            ]}
                        />
                    </Space>
                </div>
            </div>

            {/* Executive Summary */}
            <div className="mb-6">
                <ExecutiveSummary loading={loading} />
            </div>
        </div>
    );
};

export default DirectorDashboard;
