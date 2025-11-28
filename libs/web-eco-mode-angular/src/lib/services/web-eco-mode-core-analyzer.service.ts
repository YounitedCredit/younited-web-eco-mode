import { Injectable } from '@angular/core';
import { BatteryInfo, EcoModeLevel, NetworkQualityResult, WebEcoModeCoreAnalyzer } from '@younited/web-eco-mode-core';
import { Observable } from 'rxjs';

/**
 * Angular service wrapper for WebEcoModeCoreAnalyzer
 * Provides the same functionality as the core analyzer but as an Angular service
 * for dependency injection
 */
@Injectable({
  providedIn: 'root'
})
export class WebEcoModeCoreAnalyzerService extends WebEcoModeCoreAnalyzer {
  constructor() {
    super();
  }

  override setEcoModeLevelOverride(ecoMode: EcoModeLevel | undefined) {
    super.setEcoModeLevelOverride(ecoMode);
  }

  override getEcoImpactScore$(): Observable<number> {
    return super.getEcoImpactScore$();
  }

  override getEcoModeLevel$(): Observable<EcoModeLevel> {
    return super.getEcoModeLevel$();
  }

  override getEcoModeLevelWithoutOverride$(): Observable<EcoModeLevel> {
    return super.getEcoModeLevelWithoutOverride$();
  }

  override getBatteryInfo$(): Observable<BatteryInfo> {
    return super.getBatteryInfo$();
  }

  override getNetworkQuality$(): Observable<NetworkQualityResult> {
    return super.getNetworkQuality$();
  }
}

