import { Layout, Typography, Space } from 'antd';
import { AccountCard } from './components/AccountCard';
import { PositionTable } from './components/PositionTable';
import { OrderTable } from './components/OrderTable';
import { WatchlistCard } from './components/WatchlistCard';
import { KeySelector } from './components/KeySelector';
import { SettingsDropdown } from './components/SettingsDropdown';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid #e8e8e8',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <Space>
          <Title level={4} style={{ color: '#222', margin: 0, fontWeight: 600, letterSpacing: 1 }}>
            妙想模拟交易
          </Title>
        </Space>
        <Space size="middle" style={{ fontSize: 13 }}>
          <SettingsDropdown />
          <KeySelector />
        </Space>
      </Header>

      <Content style={{ padding: '16px 24px' }}>
        <div style={{ marginBottom: 16 }}>
          <AccountCard />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <PositionTable />
          <OrderTable />
        </div>
        <div style={{ marginBottom: 16 }}>
          <WatchlistCard />
        </div>
      </Content>
    </Layout>
  );
}
