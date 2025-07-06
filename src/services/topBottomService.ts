
export interface TopBottomStock {
  symbol: string;
  name: string;
  close: string;
  change_percent: string;
  volume: string;
}

export const fetchTopBottom5 = async (): Promise<TopBottomStock[]> => {
  const response = await fetch('https://n8n-maaz.duckdns.org/webhook/Top/Bottom5', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timestamp: new Date().toISOString()
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch top/bottom 5 data');
  }

  return response.json();
};
