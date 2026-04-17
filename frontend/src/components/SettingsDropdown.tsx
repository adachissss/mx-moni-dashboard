import { useState } from 'react';
import { Modal, Switch, Slider, Space, Button, Tag, message } from 'antd';
import {
  SettingOutlined,
  ReloadOutlined,
  FieldTimeOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useSettings } from '../hooks/useSettings';

export function SettingsDropdown() {
  const { settings, updateSettings } = useSettings();
  const [open, setOpen] = useState(false);

  const handleRefresh = () => {
    window.dispatchEvent(new CustomEvent('mx:refresh'));
    message.success('已刷新全部数据');
  };

  return (
    <>
      <Button
        type="text"
        icon={<SettingOutlined style={{ fontSize: 16 }} />}
        style={{ color: '#555' }}
        onClick={() => setOpen(true)}
      />

      <Modal
        title={
          <Space>
            <SettingOutlined />
            设置
          </Space>
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={
          <Button type="primary" icon={<ReloadOutlined />} onClick={handleRefresh}>
            手动刷新全部数据
          </Button>
        }
        width={380}
        centered
      >
        {/* 自动轮询 */}
        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>
              <FieldTimeOutlined style={{ marginRight: 6 }} />
              自动轮询
            </div>
            <div style={descStyle}>关闭后完全由手动刷新数据</div>
          </div>
          <Switch
            checked={settings.pollingEnabled}
            onChange={v => updateSettings({ pollingEnabled: v })}
          />
        </div>

        {/* 轮询间隔 */}
        {settings.pollingEnabled && (
          <div style={{ ...rowStyle, flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={labelStyle}>轮询间隔</div>
              <Tag color="blue">{settings.pollingInterval / 1000} 秒</Tag>
            </div>
            <Slider
              min={10}
              max={300}
              step={10}
              value={settings.pollingInterval / 1000}
              onChange={v => updateSettings({ pollingInterval: v * 1000 })}
              marks={{ 10: '10s', 60: '1min', 180: '3min', 300: '5min' }}
              tooltip={{ formatter: v => `${v}s` }}
            />
          </div>
        )}

        {/* 聚焦刷新 */}
        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>
              <EyeOutlined style={{ marginRight: 6 }} />
              聚焦时刷新
            </div>
            <div style={descStyle}>切换标签页或窗口时自动刷新</div>
          </div>
          <Switch
            checked={settings.refreshOnFocus}
            onChange={v => updateSettings({ refreshOnFocus: v })}
          />
        </div>

        {/* 当前状态 */}
        <div style={{
          marginTop: 16,
          padding: '8px 12px',
          background: '#f5f5f5',
          borderRadius: 6,
          fontSize: 12,
          color: '#666',
        }}>
          <div>自动轮询：{settings.pollingEnabled ? '● 开启' : '○ 关闭'}</div>
          {settings.pollingEnabled && (
            <div>轮询间隔：{settings.pollingInterval / 1000} 秒</div>
          )}
          <div>聚焦刷新：{settings.refreshOnFocus ? '● 开启' : '○ 关闭'}</div>
        </div>
      </Modal>
    </>
  );
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid #f0f0f0',
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 2,
};

const descStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#999',
};
