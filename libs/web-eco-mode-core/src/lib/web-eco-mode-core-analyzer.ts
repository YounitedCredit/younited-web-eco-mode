import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BatteryAnalyzer } from './analyzers/battery-analyzer';
import { NetworkAnalyzer } from './analyzers/network-analyzer';
import { BatteryInfo, EcoModeLevel, NetworkQualityResult } from './analyzers/models';

export class WebEcoModeCoreAnalyzer {

  private readonly batteryAnalyzer: BatteryAnalyzer;
  private readonly networkAnalyzer: NetworkAnalyzer;
  private readonly STORAGE_KEY = 'yuc-eco-mode-override';

  private readonly ecoModeLevelOverride$: BehaviorSubject<undefined | EcoModeLevel>;

  constructor() {
    this.batteryAnalyzer = new BatteryAnalyzer();
    this.networkAnalyzer = new NetworkAnalyzer();
    // Initialize the BehaviorSubject with the stored value after STORAGE_KEY is available
    const initialValue = this.loadFromStorage();
    this.ecoModeLevelOverride$ = new BehaviorSubject<undefined | EcoModeLevel>(initialValue);
  }

  setEcoModeLevelOverride(ecoMode: EcoModeLevel | undefined): void {
    this.ecoModeLevelOverride$.next(ecoMode);
    this.saveToStorage(ecoMode);
  }

  /**
   * Loads the eco mode override value from local storage
   * @returns The stored eco mode level or undefined if not set
   */
  private loadFromStorage(): undefined | EcoModeLevel {
    if (typeof localStorage === 'undefined') {
      return undefined;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored === null || stored === 'undefined') {
        return undefined;
      }
      // Validate that the stored value is a valid EcoModeLevel
      if (Object.values(EcoModeLevel).includes(stored as EcoModeLevel)) {
        return stored as EcoModeLevel;
      }
      return undefined;
    } catch (error) {
      console.warn('Failed to load eco mode override from storage:', error);
      return undefined;
    }
  }

  /**
   * Saves the eco mode override value to local storage
   * @param ecoMode The eco mode level to save, or undefined to clear
   */
  private saveToStorage(ecoMode: EcoModeLevel | undefined): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      if (ecoMode === undefined) {
        localStorage.removeItem(this.STORAGE_KEY);
      } else {
        localStorage.setItem(this.STORAGE_KEY, ecoMode);
      }
    } catch (error) {
      console.warn('Failed to save eco mode override to storage:', error);
    }
  }

  /**
   * Gets a real-time stream of eco impact score that updates automatically
   * based on battery and network conditions
   * @returns An Observable that emits eco impact score updates (0-100)
   */
  getEcoImpactScore$(): Observable<number> {
    return combineLatest([
      this.batteryAnalyzer.getBatteryInfo$(),
      this.networkAnalyzer.getNetworkQuality$()
    ]).pipe(
      map(([batteryInfo, networkQuality]) => {
        let score = 50; // Base score

        // Battery contribution (0-35 points)
        if (batteryInfo.supported && batteryInfo.level !== undefined) {
          // Higher battery level = higher eco impact score (up to 35 points)
          score += (batteryInfo.level * 35);
          // Small bonus if charging (device has stable power source)
          if (batteryInfo.charging) {
            score += 5;
          }
        }

        // Network contribution: bonus for good quality, penalty for poor/average
        if (networkQuality.score >= 75) {
          // Good network: bonus up to 15 points
          score += ((networkQuality.score - 75) / 25) * 15;
        } else if (networkQuality.score >= 50) {
          // Average network: small penalty (0 to -10 points)
          score -= ((75 - networkQuality.score) / 25) * 10;
        } else {
          // Poor network: much larger penalty (-10 to -30 points)
          score -= 10 + ((50 - networkQuality.score) / 50) * 20;
        }

        // Ensure score is between 0 and 100
        return Math.max(0, Math.min(100, Math.round(score)));
      })
    );
  }

  getEcoModeLevel$(): Observable<EcoModeLevel> {
    return combineLatest([
      this.getEcoImpactScore$(),
      this.ecoModeLevelOverride$
    ]).pipe(
      map(([score, override]) => {
        if (override !== undefined) {
          return override;
        }
        return this.computeEcoModeLevel(score);
      })
    );
  }

  getEcoModeLevelWithoutOverride$(): Observable<EcoModeLevel> {
    return this.getEcoImpactScore$().pipe(
      map(this.computeEcoModeLevel)
    );
  }

  /**
   * Gets a real-time stream of battery information that updates automatically
   * when battery status changes (charging, level, etc.)
   * @returns An Observable that emits battery info updates
   */
  getBatteryInfo$(): Observable<BatteryInfo> {
    return this.batteryAnalyzer.getBatteryInfo$();
  }

  /**
   * Gets a real-time stream of network quality that updates automatically
   * when network conditions change (connection type, online/offline status, etc.)
   * @returns An Observable that emits network quality updates
   */
  getNetworkQuality$(): Observable<NetworkQualityResult> {
    return this.networkAnalyzer.getNetworkQuality$();
  }

  private computeEcoModeLevel(impactScore: number) {
    if (impactScore >= 75) {
      return EcoModeLevel.High;
    } else if (impactScore >= 40) {
      return EcoModeLevel.Medium;
    } else {
      return EcoModeLevel.Low;
    }
  }
}

