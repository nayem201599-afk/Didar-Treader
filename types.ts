
export interface TradingSignal {
  id: string;
  market: string;
  marketType: 'OTC' | 'Real';
  timeframe: string;
  signal: 'CALL' | 'PUT' | 'BUY' | 'SELL' | 'NO TRADE';
  entry: string;
  confidence: string;
  timestamp: number;
  algorithmDescription?: string;
  strategyExplanation?: string;
  technicalPoints?: string[];
  sources?: { uri: string; title: string }[];
}

export interface SignalResponse {
  market: string;
  marketType: 'OTC' | 'Real';
  timeframe: string;
  signal: string;
  entry: string;
  confidence: string;
  algorithmDescription: string;
  strategyExplanation: string;
  technicalPoints: string[];
  sources?: { uri: string; title: string }[];
}

export interface InfoNote {
  id: string;
  content: string;
  timestamp: number;
}
