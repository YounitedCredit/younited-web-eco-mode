# @younited/web-eco-mode-core

Core TypeScript library for monitoring eco-friendly metrics including battery status and network quality. This library is framework-agnostic and can be used with any JavaScript/TypeScript framework.

## Features

- **Battery Monitoring**: Real-time battery status tracking using the Battery Status API
- **Network Quality Analysis**: Network connection monitoring and quality assessment
- **Eco impact Score Calculation**: Combined metric for overall device eco-friendliness
- **RxJS Observables**: Reactive streams for all metrics
- **TypeScript**: Full type safety and IntelliSense support
- **Framework Agnostic**: Can be used with Angular, React, Vue, or vanilla JavaScript

## Installation

```bash
npm install @younited/web-eco-mode-core rxjs
```

## Usage

```typescript
import { WebEcoModeCoreAnalyzer } from '@younited/web-eco-mode-core';

const analyzer = new WebEcoModeCoreAnalyzer();

// Subscribe to eco impact score updates
analyzer.getEcoImpactScore$().subscribe(score => {
  console.log('Eco Impact Score:', score);
});

// Subscribe to battery info
analyzer.getBatteryInfo$().subscribe(battery => {
  console.log('Battery Level:', battery.levelPercentage);
});

// Subscribe to network quality
analyzer.getNetworkQuality$().subscribe(network => {
  console.log('Network Score:', network.score);
});

// Subscribe to eco mode level
analyzer.getEcoModeLevel$().subscribe(mode => {
  console.log('Eco Mode:', mode); // 'Low' | 'Medium' | 'High'
});

// Manually override the eco mode level
// This setting is saved to local storage and persists across page reloads
analyzer.setEcoModeLevelOverride(EcoMode.Low);

// Get the calculated eco mode level without override
analyzer.getEcoModeLevelWithoutOverride$().subscribe(mode => {
  console.log('Calculated Eco Mode:', mode);
});

// Clear the override to use automatic calculation
// This also removes the value from local storage
analyzer.setEcoModeLevelOverride(undefined);
```

## API

### WebEcoModeCoreAnalyzer

Main analyzer class that provides all monitoring functionality.

#### Methods

- `getEcoImpactScore$(): Observable<number>` - Returns a stream of eco impact scores (0-100)
- `getEcoModeLevel$(): Observable<EcoMode>` - Returns a stream of eco mode levels (with override applied if set)
- `getEcoModeLevelWithoutOverride$(): Observable<EcoMode>` - Returns a stream of eco mode levels based only on the calculated score (ignores override)
- `setEcoModeLevelOverride(ecoMode: EcoMode | undefined): void` - Manually override the eco mode level. Pass `undefined` to clear the override and use automatic calculation. The override is persisted to browser's local storage and restored on page reload
- `getBatteryInfo$(): Observable<BatteryInfo>` - Returns a stream of battery information
- `getNetworkQuality$(): Observable<NetworkQualityResult>` - Returns a stream of network quality

### Types

```typescript
enum EcoMode {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

interface BatteryInfo {
  supported: boolean;
  charging?: boolean;
  chargingTime?: number;
  dischargingTime?: number;
  level?: number;
  levelPercentage?: number;
}

interface NetworkQualityResult {
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
```

## Local Storage Persistence

The eco mode override setting is automatically persisted to the browser's local storage under the key `yuc-eco-mode-override`. This means:

- ✅ User preferences are preserved across page reloads
- ✅ Settings persist even if the browser is closed and reopened
- ✅ Each browser/device maintains its own setting
- ✅ Clearing the override removes the stored value
- ✅ Gracefully handles environments without local storage (e.g., SSR)

## Browser Support

- Battery Status API: Limited support (mainly Chromium-based browsers)
- Network Information API: Limited support
- Local Storage API: Universal support in all modern browsers
- The library gracefully handles unsupported APIs

## License

MIT

