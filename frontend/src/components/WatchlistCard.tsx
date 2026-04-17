import { Card, Table, Tag, Empty, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useWatchlist } from '../hooks/useWatchlist';

export function WatchlistCard() {
  const { stocks, loading, error, refresh } = useWatchlist();

  const columns = [
    { title: '代码', dataIndex: 'code', width: 80 },
    { title: '名称', dataIndex: 'name', width: 90 },
    {
      title: '最新价',
      dataIndex: 'price',
      width: 80,
      render: (v: number) => (v ?? 0).toFixed(2),
    },
    {
      title: '涨跌幅',
      dataIndex: 'changeRate',
      width: 85,
      render: (v: number) => {
        const up = (v ?? 0) >= 0;
        return (
          <Tag color={up ? 'error' : 'success'}>
            {up ? '+' : ''}{(v ?? 0).toFixed(2)}%
          </Tag>
        );
      },
    },
    {
      title: '涨跌额',
      dataIndex: 'change',
      width: 75,
      render: (v: number) => {
        const up = (v ?? 0) >= 0;
        return <span style={{ color: up ? '#ff4d4f' : '#52c41a' }}>{up ? '+' : ''}{(v ?? 0).toFixed(2)}</span>;
      },
    },
  ];

  return (
    <Card
      title="自选股"
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
          <strong>[自选股]</strong> {error.message}
          {!error.isBlocking && (
            <Button type="link" size="small" icon={<ReloadOutlined />} onClick={refresh} style={{ padding: '0 4px', height: 'auto', fontSize: 12 }}>
              重试
            </Button>
          )}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={stocks}
        rowKey="code"
        size="small"
        pagination={{ pageSize: 10, size: 'small' }}
        locale={{ emptyText: <Empty description="暂无自选股" /> }}
        scroll={{ x: 400 }}
      />
    </Card>
  );
}
