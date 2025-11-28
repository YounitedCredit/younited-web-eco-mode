import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { WebEcoModeCoreAnalyzerService } from '../services/web-eco-mode-core-analyzer.service';
import { BatteryInfo, EcoModeLevel, NetworkQualityResult } from '@younited/web-eco-mode-core';

@Component({
  selector: 'yuc-web-eco-mode-widget',
  imports: [CommonModule],
  templateUrl: './web-eco-mode-widget.html',
  styleUrl: './web-eco-mode-widget.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone : true
})
export class WebEcoModeWidget {
  private readonly analyzer = inject(WebEcoModeCoreAnalyzerService);

  protected ecoImpactScore = toSignal(this.analyzer.getEcoImpactScore$(), { initialValue: 50 });
  protected ecoModeLevel = toSignal(this.analyzer.getEcoModeLevel$(), { initialValue: EcoModeLevel.Medium });
  protected ecoModeLevelWithoutOverride = toSignal(this.analyzer.getEcoModeLevelWithoutOverride$(), { initialValue: EcoModeLevel.Medium });
  protected networkQuality = toSignal(this.analyzer.getNetworkQuality$(), {
    initialValue: { score: 50, details: { isOnline: true, assessment: 'Average' } } as NetworkQualityResult
  });
  protected batteryInfo = toSignal(this.analyzer.getBatteryInfo$(), { initialValue: {supported : false} as BatteryInfo  });
  protected showNetworkDetails = signal(false);
  protected showBatteryDetails = signal(false);
  protected isWidgetExpanded = signal(false);

  protected readonly ecoModeLevels = [EcoModeLevel.Low, EcoModeLevel.Medium, EcoModeLevel.High];

  toggleNetworkDetails() {
    this.showNetworkDetails.update(value => !value);
  }

  toggleBatteryDetails() {
    this.showBatteryDetails.update(value => !value);
  }

  toggleWidget() {
    this.isWidgetExpanded.update(value => !value);
    if (!this.isWidgetExpanded()) {
      this.showNetworkDetails.set(false);
      this.showBatteryDetails.set(false);
    }
  }

  onEcoModeChange(event: Event) {
    const sliderValue = +(event.target as HTMLInputElement).value;
    const selectedMode = this.ecoModeLevels[sliderValue];
    this.analyzer.setEcoModeLevelOverride(selectedMode);
  }

  getEcoModeSliderValue(): number {
    return this.ecoModeLevels.indexOf(this.ecoModeLevel());
  }
}

