import { Card, Statistic, Row, Col, Tag, Button } from 'antd';
import { WalletOutlined, RiseOutlined, FallOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAccount } from '../hooks/useSharedMarketData';
import { useApiKeys } from '../hooks/useApiKeys';

export function AccountCard() {
  const { data, loading, error, refresh } = useAccount();
  const { current } = useApiKeys();

  const base = data.initMoney ?? 1000000;
  const profit = data.totalProfit;
  const profitRate = data.profitRate;
  const isProfit = profit >= 0;

  return (
    <Card
      title={<><WalletOutlined /> 账户总览</>}
      loading={loading}
      extra={
        <Button
          type="text"
          size="small"
          icon={<ReloadOutlined />}
          onClick={refresh}
          style={{ fontSize: 12, color: '#999' }}
        >
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
          <strong>[账户]</strong> {error.message}
          {!error.isBlocking && (
            <Button
              type="link"
              size="small"
              icon={<ReloadOutlined />}
              onClick={refresh}
              style={{ padding: '0 4px', height: 'auto', fontSize: 12 }}
            >
              重试
            </Button>
          )}
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <Tag color="blue">{current.name}</Tag>
        {data.accName && <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>{data.accName}</span>}
        {data.accId && <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>ID: {data.accId}</span>}
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <Statistic title="总资产" value={data.totalAssets} precision={2} prefix="¥" loading={loading} />
        </Col>
        <Col span={8}>
          <Statistic title="可用资金" value={data.availBalance} precision={2} prefix="¥" loading={loading} />
        </Col>
        <Col span={8}>
          <Statistic title="持仓市值" value={data.totalPosValue} precision={2} prefix="¥" loading={loading} />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card size="small" style={{ background: '#fafafa' }}>
            <Statistic
              title="累计盈亏"
              value={Math.abs(profit)}
              precision={2}
              prefix={isProfit ? <RiseOutlined /> : <FallOutlined />}
              suffix="元"
              styles={{ content: { color: isProfit ? '#ff4d4f' : '#52c41a' } }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" style={{ background: '#fafafa' }}>
            <div style={{ marginBottom: 4 }}>盈亏率</div>
            <div style={{
              fontSize: 28,
              fontWeight: 600,
              color: isProfit ? '#ff4d4f' : '#52c41a',
              lineHeight: 1.2,
            }}>
              {isProfit ? '+' : ''}{profitRate.toFixed(2)}%
            </div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>基准：{base.toLocaleString()} 元</div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
