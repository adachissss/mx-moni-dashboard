import { Card, Table, Tag, Empty, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined } from '@ant-design/icons';
import { usePositions } from '../hooks/useSharedMarketData';
import type { Position } from '../types';

export function PositionTable() {
  const { data, loading, error, refresh } = usePositions();

  const columns: ColumnsType<Position> = [
    { title: '股票代码', dataIndex: 'stockCode', width: 100 },
    { title: '股票名称', dataIndex: 'stockName', width: 120 },
    {
      title: '持股数量',
      dataIndex: 'quantity',
      width: 100,
      render: (v) => v.toLocaleString() + ' 股',
    },
    {
      title: '成本价',
      dataIndex: 'avgCost',
      width: 100,
      render: (v) => v.toFixed(2) + ' 元',
    },
    {
      title: '现价',
      dataIndex: 'currentPrice',
      width: 100,
      render: (v) => v.toFixed(2) + ' 元',
    },
    {
      title: '盈亏金额',
      dataIndex: 'profit',
      width: 120,
      render: (v) => {
        const sign = v >= 0 ? '+' : '';
        return <span style={{ color: v >= 0 ? '#ff4d4f' : '#52c41a' }}>{sign}{v.toFixed(2)} 元</span>;
      },
    },
    {
      title: '盈亏率',
      dataIndex: 'profitRate',
      width: 100,
      render: (v) => {
        const sign = v >= 0 ? '+' : '';
        return <Tag color={v >= 0 ? 'error' : 'success'}>{sign}{v.toFixed(2)}%</Tag>;
      },
    },
  ];

  return (
    <Card
      title="当前持仓"
      loading={loading}
      extra={
        <Button type="text" size="small" icon={<ReloadOutlined />} onClick={refresh} style={{ fontSize: 12, color: '#999' }}>
          刷新
        </Button>
      }
    >
      {error && (
        <div style={{
          marginBottom: 12,
          padding: '8px 12px',
          borderRadius: 6,
          background: error.isBlocking ? '#fff2e8' : '#fffbe6',
          border: `1px solid ${error.isBlocking ? '#ffbb96' : '#ffe58f'}`,
          color: error.isBlocking ? '#d46b08' : '#ad6800',
          fontSize: 13,
        }}>
          <strong>[持仓]</strong> {error.message}
          {!error.isBlocking && (
            <Button type="link" size="small" icon={<ReloadOutlined />} onClick={refresh} style={{ padding: '0 4px', height: 'auto', fontSize: 12 }}>
              重试
            </Button>
          )}
        </div>
      )}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="stockCode"
        size="small"
        pagination={false}
        locale={{ emptyText: <Empty description="暂无持仓" /> }}
      />
    </Card>
  );
}
