import { Card, Table, Tag, Tabs, Empty, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined } from '@ant-design/icons';
import { useOrders } from '../hooks/useSharedMarketData';
import type { Order } from '../types';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:   { label: '未成交', color: 'default' },
  partial:   { label: '部分成交', color: 'processing' },
  filled:    { label: '已成交', color: 'success' },
  cancelled: { label: '已撤单', color: 'warning' },
  rejected:  { label: '已拒绝', color: 'error' },
};

export function OrderTable() {
  const { data, loading, error, refresh } = useOrders();

  const active = data.filter(o => o.status === 'pending' || o.status === 'partial');
  const history = data.filter(o => o.status === 'filled' || o.status === 'cancelled' || o.status === 'rejected');

  const columns: ColumnsType<Order> = [
    { title: '委托时间', dataIndex: 'orderTime', width: 160 },
    { title: '股票代码', dataIndex: 'stockCode', width: 100 },
    { title: '股票名称', dataIndex: 'stockName', width: 120 },
    {
      title: '方向',
      dataIndex: 'direction',
      width: 70,
      render: (v) => <Tag color={v === 'buy' ? 'red' : 'green'}>{v === 'buy' ? '买入' : '卖出'}</Tag>,
    },
    { title: '委托价格', dataIndex: 'price', width: 100, render: (v) => v.toFixed(2) + ' 元' },
    { title: '委托数量', dataIndex: 'quantity', width: 100, render: (v) => v.toLocaleString() + ' 股' },
    { title: '已成交', dataIndex: 'filledQty', width: 100, render: (v) => v.toLocaleString() + ' 股' },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v) => {
        const s = STATUS_MAP[v] ?? { label: v, color: 'default' };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
  ];

  const tabItems = [
    {
      key: 'active',
      label: `进行中 (${active.length})`,
      children: (
        <Table
          columns={columns}
          dataSource={active}
          rowKey="orderId"
          size="small"
          pagination={false}
          locale={{ emptyText: <Empty description="暂无进行中委托" /> }}
        />
      ),
    },
    {
      key: 'history',
      label: `历史委托 (${history.length})`,
      children: (
        <Table
          columns={columns}
          dataSource={history}
          rowKey="orderId"
          size="small"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description="暂无历史委托" /> }}
        />
      ),
    },
  ];

  return (
    <Card
      title="委托订单"
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
          <strong>[委托]</strong> {error.message}
          {!error.isBlocking && (
            <Button type="link" size="small" icon={<ReloadOutlined />} onClick={refresh} style={{ padding: '0 4px', height: 'auto', fontSize: 12 }}>
              重试
            </Button>
          )}
        </div>
      )}
      <Tabs items={tabItems} defaultActiveKey="active" />
    </Card>
  );
}
