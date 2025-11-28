# @younited/web-eco-mode-angular

Angular wrapper library for `@younited/web-eco-mode-core`. Provides Angular components and services for monitoring eco-friendly metrics in Angular applications.

## Features

- **WebEcoModeWidget Component**: Ready-to-use Angular component with beautiful UI
- **WebEcoModeCoreAnalyzerService**: Angular service wrapper for dependency injection
- **Full Type Safety**: Complete TypeScript support
- **Standalone Components**: Modern Angular standalone API
- **Signal-based**: Uses Angular signals for reactive state management
- **Accessibility**: WCAG compliant with ARIA labels

## Installation

```bash
npm install @younited/web-eco-mode-angular @younited/web-eco-mode-core rxjs
```

## Usage

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { WebEcoModeWidget } from '@younited/web-eco-mode-angular';

@Component({
  selector: 'app-root',
  imports: [WebEcoModeWidget],
  template: `
    <h1>My App</h1>
    <yuc-web-eco-mode-widget />
  `,
  standalone: true
})
export class AppComponent {}
```

### Using the Service

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { WebEcoModeCoreAnalyzerService } from '@younited/web-eco-mode-angular';

@Component({
  selector: 'app-dashboard',
  template: `
    <div>Eco Impact Score: {{ ecoImpactScore }}</div>
  `,
  standalone: true
})
export class DashboardComponent implements OnInit {
  private analyzer = inject(WebEcoModeCoreAnalyzerService);
  ecoImpactScore = 0;

  ngOnInit() {
    this.analyzer.getEcoImpactScore$().subscribe(score => {
      this.ecoImpactScore = score;
    });
  }
}
```

### Using Signals

```typescript
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { WebEcoModeCoreAnalyzerService, EcoMode } from '@younited/web-eco-mode-angular';

@Component({
  selector: 'app-dashboard',
  template: `
    <div>Eco Mode: {{ ecoMode() }}</div>
    <div>Eco Impact Score: {{ ecoImpactScore() }}</div>
  `,
  standalone: true
})
export class DashboardComponent {
  private analyzer = inject(WebEcoModeCoreAnalyzerService);
  
  ecoMode = toSignal(this.analyzer.getEcoModeLevel$(), { 
    initialValue: EcoMode.Medium 
  });

  ecoImpactScore = toSignal(this.analyzer.getEcoImpactScore$(), { 
    initialValue: 50 
  });
}
```

### Manual Eco Mode Override

You can manually override the eco mode level from anywhere in your application:

```typescript
import { Component, inject } from '@angular/core';
import { WebEcoModeCoreAnalyzerService, EcoMode } from '@younited/web-eco-mode-angular';

@Component({
  selector: 'app-settings',
  template: `
    <button (click)="setLowPowerMode()">Enable Low Power Mode</button>
    <button (click)="clearOverride()">Auto Mode</button>
  `,
  standalone: true
})
export class SettingsComponent {
  private analyzer = inject(WebEcoModeCoreAnalyzerService);

  setLowPowerMode() {
    // Manually set to Low mode
    this.analyzer.setEcoModeLevelOverride(EcoMode.Low);
  }

  clearOverride() {
    // Clear override and use automatic calculation
    this.analyzer.setEcoModeLevelOverride(undefined);
  }
}
```

Since the service is a singleton, this change will be reflected in the `WebEcoModeWidget` and all other components using the service.

**Note**: The eco mode override is automatically saved to the browser's local storage and will persist across page reloads.


## Components

### WebEcoModeWidget

A fully styled, collapsible widget that displays:
- **Eco Mode Slider**: Interactive slider to manually override the eco mode level (Low/Medium/High)
- **Eco Impact Score**: Displayed directly over an animated power bar with gradient fill
- **Calculated Eco Mode**: Shows the automatically calculated eco mode based on battery and network conditions
- **Network Quality**: Expandable section with detailed network information
- **Battery Status**: Expandable section with battery level and charging status (when supported)

The widget is positioned fixed in the bottom-right corner and includes:
- Smooth animations and transitions
- Responsive design for mobile and desktop
- Modern glassmorphic design with gradient backgrounds
- Full keyboard navigation support
- WCAG compliant accessibility features
- Compact, space-efficient layout

## Services

### WebEcoModeCoreAnalyzerService

Injectable Angular service that extends `WebEcoModeCoreAnalyzer` from the core library.

This service is provided at the root level (`providedIn: 'root'`), which means it's a **singleton** shared across the entire application. The `WebEcoModeWidget` component uses this singleton instance, ensuring that any eco mode changes made through the widget's slider are immediately reflected throughout your application.

**Methods:**
- `getEcoImpactScore$(): Observable<number>` - Stream of eco impact scores (0-100)
- `getEcoModeLevel$(): Observable<EcoMode>` - Stream of current eco mode (with override applied)
- `getEcoModeLevelWithoutOverride$(): Observable<EcoMode>` - Stream of calculated eco mode (ignores manual override)
- `setEcoModeLevelOverride(ecoMode: EcoMode | undefined): void` - Manually set eco mode level or clear override
- `getBatteryInfo$(): Observable<BatteryInfo>` - Stream of battery information
- `getNetworkQuality$(): Observable<NetworkQualityResult>` - Stream of network quality metrics

## Exports

All types and enums from `@younited/web-eco-mode-core` are re-exported for convenience:
- `EcoMode`
- `BatteryInfo`
- `NetworkQualityResult`
- `BatteryAnalyzer`
- `NetworkAnalyzer`
- `WebEcoModeCoreAnalyzer`

## Requirements

- Angular 20.1.0 or higher
- RxJS 7.8.0 or higher

## License

MIT

