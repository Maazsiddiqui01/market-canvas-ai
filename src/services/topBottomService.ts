export interface TopBottomStock {
  symbol: string;
  name: string;
  close: string;
  change_percent: string;
  volume: string;
}

export const fetchTopBottom5 = async (): Promise<TopBottomStock[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch('https://n8n.80.225.213.232.sslip.io/webhook/Top/Bottom5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: new Date().toISOString() }),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch top/bottom 5 data: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? (data as TopBottomStock[]) : [];
  } catch (e) {
    console.error('fetchTopBottom5 failed:', e);
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
};
