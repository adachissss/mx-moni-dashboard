/**
 * API 错误码映射
 * 返回 (用户友好的中文提示, 是否阻断重试)
 */
export function mapApiError(code: number | string, status: number): [string, boolean] {
  const key = Number(status) || Number(code);

  switch (key) {
    case 112:
      return ['请求频率过高，请稍后刷新', false];
    case 113:
      return ['今日API调用次数已达上限（免费版50次/天）', true];
    case 114:
    case 116:
      return ['API密钥无效，请检查账户配置', true];
    case 115:
      return ['未携带API密钥，请检查账户配置', true];
    case 404:
      return ['未绑定模拟账户，请先在妙想创建账户', true];
    default:
      if (status === 0 || code === 0) {
        return ['', false]; // 无错误
      }
      return [`接口异常 (${status}/${code})，请稍后重试`, false];
  }
}

export interface ApiError {
  message: string;
  isBlocking: boolean;   // true = 不可重试，需用户介入
  raw?: string;
}

/**
 * 从 axios 错误响应中提取信息
 */
export function parseApiError(error: any, fallbackMsg = '加载失败'): ApiError {
  if (!error?.response) {
    // 网络错误
    return { message: '网络连接失败，请检查网络', isBlocking: false };
  }

  const { status, data } = error.response;
  const code = data?.code ?? data?.status ?? status;
  const msg = data?.message ?? '';

  // 频率限制 / 配额用
  if (status === 429 || status === 113 || code === 113 || code === 112) {
    const [friendlyMsg, blocking] = mapApiError(code, status);
    return { message: friendlyMsg, isBlocking: blocking };
  }

  // data 为 null 说明是频率限制
  if (data === null || data?.data === null) {
    const [friendlyMsg, blocking] = mapApiError(code, status);
    return { message: friendlyMsg, isBlocking: blocking };
  }

  if (msg) return { message: msg, isBlocking: false };
  return { message: fallbackMsg, isBlocking: false };
}
