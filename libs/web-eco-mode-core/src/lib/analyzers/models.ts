export interface BatteryInfo {
  supported: boolean;
  charging?: boolean;
  chargingTime?: number;
  dischargingTime?: number;
  level?: number;
  levelPercentage?: number;
}

export interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

export interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export interface NetworkInformation {
  effectiveType?: '2g' | '3g' | '4g' | '5g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  type?: string;
  addEventListener?: (type: string, callback: EventListener) => void;
  removeEventListener?: (type: string, callback: EventListener) => void;
}

export interface NetworkQualityResult {
  score: number;
  details: {
    connectionType?: string;
    downlinkSpeed?: number;
    rtt?: number;
    isOnline: boolean;
    avgLoadTime?: number;
    assessment: string;
  };
}

export interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

export  enum  EcoModeLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

