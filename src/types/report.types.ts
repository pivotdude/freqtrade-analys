import type {
  EnterTagStatisticsReport,
  PairStatisticsReport,
  Trade,
  TradeStatistics,
  TradingInfo,
} from "./trade.types";
import type { ReportLanguage } from "./i18n.types";

export interface AnalysisReportPayload {
  generatedAt: string;
  language: ReportLanguage;
  trades: Trade[];
  statistics: TradeStatistics;
  pairStats: PairStatisticsReport[];
  tagStats: EnterTagStatisticsReport[];
  topProfitable: Trade[];
  topLosing: Trade[];
  tradingInfo: TradingInfo;
}
