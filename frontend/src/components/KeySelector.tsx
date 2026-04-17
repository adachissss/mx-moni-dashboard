import { useState, useRef } from 'react';
import { Dropdown, Button, Modal, Input, Space, message, Popconfirm } from 'antd';
import { KeyOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useApiKeys } from '../hooks/useApiKeys';

export function KeySelector() {
  const { keys, current, selectKey, addKey, removeKey } = useApiKeys();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [adding, setAdding] = useState(false);
  const justAdded = useRef(false);

  const handleAdd = async () => {
    if (!newName.trim() || !newKey.trim()) {
      message.error('请填写名称和Key');
      return;
    }
    if (keys.find(k => k.name === newName.trim())) {
      message.error('名称已存在');
      return;
    }
    setAdding(true);
    justAdded.current = true;
    try {
      await addKey(newName.trim(), newKey.trim());
      setNewName('');
      setNewKey('');
      setOpen(false);
    } finally {
      setAdding(false);
      justAdded.current = false;
    }
  };

  const handleRemove = async (id: number, name: string) => {
    if (name === '默认账户') {
      message.error('默认账户不可删除');
      return;
    }
    await removeKey(id);
    message.success(`已删除账户: ${name}`);
  };

  const items = keys.map(k => ({
    key: String(k.id ?? k.name),
    label: (
      <span style={{ color: k.name === current.name ? '#52c41a' : '#e0e0e0' }}>
        {k.name === current.name ? '● ' : ''}{k.name}
      </span>
    ),
    onClick: () => selectKey(k),
  }));

  return (
    <>
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        placement="bottomRight"
        overlayClassName="key-dropdown"
      >
        <Button icon={<KeyOutlined />} size="small" style={{ borderColor: '#d9d9d9', color: '#333' }}>
          {current.name} <span style={{ opacity: 0.6 }}> ▼</span>
        </Button>
      </Dropdown>

      <Modal
        title="管理账户"
        open={open}
        onCancel={() => { setOpen(false); setNewName(''); setNewKey(''); }}
        footer={null}
        width={440}
        destroyOnClose
      >
        <div style={{ marginBottom: 20 }}>
          {keys.map(k => (
            <div
              key={String(k.id ?? k.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: k.name === current.name ? 600 : 400, color: k.name === current.name ? '#52c41a' : undefined }}>
                  {k.name === current.name ? '● ' : ''}{k.name}
                </div>
                <div style={{ fontSize: 11, color: '#999' }}>
                  ID: {k.id ?? '-'}
                </div>
              </div>
              {k.name !== '默认账户' && k.id !== undefined ? (
                <Popconfirm
                  title="删除此账户？"
                  onConfirm={() => handleRemove(k.id!, k.name)}
                  okText="删除"
                  cancelText="取消"
                  okButtonProps={{ danger: true }}
                >
                  <Button type="text" size="small" icon={<DeleteOutlined />} danger />
                </Popconfirm>
              ) : (
                <div style={{ width: 32 }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>添加新账户</div>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              placeholder="账户名称"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onPressEnter={handleAdd}
            />
            <Input.Password
              placeholder="API Key"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              onPressEnter={handleAdd}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              block
              onClick={handleAdd}
              loading={adding}
            >
              添加账户
            </Button>
          </Space>
        </div>
      </Modal>

      <Button
        type="text"
        icon={<PlusOutlined />}
        style={{ color: '#555' }}
        onClick={() => setOpen(true)}
      />
    </>
  );
}
