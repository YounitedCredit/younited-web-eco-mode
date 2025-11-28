import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WebEcoModeCoreAnalyzerService, WebEcoModeWidget } from '@younited/web-eco-mode-angular';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { EcoModeLevel } from '@younited/web-eco-mode-core';

@Component({
  imports: [ RouterModule, WebEcoModeWidget, CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone : true,
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly analyzer = inject(WebEcoModeCoreAnalyzerService);

  protected ecoModeLevel = toSignal(this.analyzer.getEcoModeLevel$(), {
    initialValue: EcoModeLevel.Medium
  });

  protected particleCount = computed(() => {
    const level = this.ecoModeLevel();
    // Create more particles for High (resource intensive), fewer for Medium, none for Low
    switch (level) {
      case EcoModeLevel.High:
        return new Array(100).fill(0).map((_, i) => i);
      case EcoModeLevel.Medium:
        return new Array(20).fill(0).map((_, i) => i);
      case EcoModeLevel.Low:
        return [];
      default:
        return [];
    }
  });

  constructor() {
    effect(() => {
      console.log('[App] Eco mode level changed to:', this.ecoModeLevel());
    });
  }

  protected getAnimationDuration(): number {
    // Faster animation for High (more intensive), slower for Medium
    return this.ecoModeLevel() === EcoModeLevel.High ? 3 : 5;
  }

  protected trackByIndex(index: number): number {
    return index;
  }
}
