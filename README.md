# 🌱 younited-web-eco-mode

A comprehensive TypeScript/Angular library ecosystem for monitoring and managing eco-friendly metrics in web applications. Track battery status, network quality, and overall device eco-friendliness with beautiful, accessible UI components.

## 📦 Packages

This monorepo contains two main libraries:

### [@younited/web-eco-mode-core](./libs/web-eco-mode-core)
Framework-agnostic TypeScript library for eco-mode monitoring with RxJS observables.

### [@younited/web-eco-mode-angular](./libs/web-eco-mode-angular)
Angular-specific wrapper with ready-to-use components and services.

## 🚀 Features

- **🔋 Battery Monitoring**: Real-time battery status tracking
- **📡 Network Quality Analysis**: Connection monitoring and assessment
- **📊 Eco Impact Score**: Combined metric for device eco-friendliness
- **🎛️ Manual Override**: Interactive slider to manually set eco mode level
- **💾 Local Storage**: User preferences persist across page reloads
- **🎨 Beautiful Widget**: Pre-built, customizable Angular component
- **♿ Accessibility**: WCAG compliant with full keyboard support
- **🔄 Reactive**: Built on RxJS observables for real-time updates
- **📱 Responsive**: Works seamlessly on desktop and mobile
- **🎯 Type-Safe**: Full TypeScript support

## 🎯 Quick Start

### Installation

```bash
npm install @younited/web-eco-mode-angular @younited/web-eco-mode-core rxjs
```

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { WebEcoModeWidget } from '@younited/web-eco-mode-angular';

@Component({
  selector: 'app-root',
  imports: [WebEcoModeWidget],
  template: `
    <h1>My Eco-Friendly App</h1>
    <yuc-web-eco-mode-widget />
  `,
  standalone: true
})
export class AppComponent {}
```

That's it! The widget will appear in the bottom-right corner with:
- Real-time eco impact score
- Interactive eco mode slider (Low/Medium/High)
- Expandable network and battery details

## 🎮 Demo Application

Try the live demo at **[web-eco-mode-demo](apps/web-eco-mode-demo)** to see the library in action!

The demo application showcases how the eco mode system dynamically adapts application behavior based on device conditions:

### What the Demo Shows
- **📊 Real-time Monitoring**: Live eco impact score updates based on battery and network status
- **🎨 Adaptive Animations**: Animation intensity changes automatically:
  - **High Mode** (Score 67-100): 100 animated particles - simulating resource-intensive operations
  - **Medium Mode** (Score 34-66): 20 animated particles - moderate resource usage
  - **Low Mode** (Score 0-33): No animations - energy-saving mode activated
- **🎛️ Manual Control**: Interactive slider to override automatic detection
- **💾 Persistent Settings**: Manual overrides saved to local storage
- **📱 Responsive Widget**: Expandable/collapsible widget with detailed metrics

### Running the Demo

Start the development server:

```bash
npx nx serve web-eco-mode-demo
```

Then open http://localhost:4200 in your browser.

> **💡 Tip**: Try changing your browser's network throttling or simulating low battery to see the eco mode adapt in real-time!

## 🏗️ Development

### Build Libraries

Build the core library:
```bash
npx nx build web-eco-mode-core
```

Build the Angular library:
```bash
npx nx build web-eco-mode-angular
```

### Test

Run tests for all projects:
```bash
npx nx run-many -t test
```

### Lint

Lint all projects:
```bash
npx nx run-many -t lint
```

## 🏛️ Architecture

```
younited-web-eco-mode/
├── libs/
│   ├── web-eco-mode-core/          # Framework-agnostic core library
│   │   ├── analyzers/             # Battery and Network analyzers
│   │   └── web-eco-mode-core-analyzer.ts
│   └── web-eco-mode-angular/       # Angular wrapper library
│       ├── services/              # Angular services
│       └── web-eco-mode-widget/   # Widget component
└── apps/
    └── web-eco-mode-demo/          # Interactive demo application
        ├── src/app/               # Demo app showcasing adaptive behavior
        │   ├── app.ts            # Main component with eco-mode signals
        │   └── app.html          # Adaptive animation demo
        └── project.json          # Nx configuration
```

### Demo Application Features
The **web-eco-mode-demo** app serves as both a testing ground and integration example, demonstrating:
- Real-time eco mode detection and UI adaptation
- Angular signals integration with `toSignal()` for reactive state management
- Computed signals for derived state (particle counts based on eco mode)
- Effects for logging and side effects
- Practical example of how to adjust application behavior based on device conditions

## 🔑 Key Concepts

### Eco Impact Score (0-100)
A calculated metric based on:
- **Battery Level**: Higher battery = higher score (up to 35 points)
- **Charging Status**: Small bonus when charging (5 points)
- **Network Quality**: Good network adds bonus, poor network adds penalty (-30 to +15 points)

### Eco Mode Levels
- **Low**: Score 0-33 (High power consumption)
- **Medium**: Score 34-66 (Moderate power consumption)
- **High**: Score 67-100 (Eco-friendly, low power consumption)

### Manual Override
Users can manually override the eco mode via the interactive slider. This override is:
- Stored in a `BehaviorSubject` for reactive updates
- Immediately propagated to all subscribers across the application
- Persisted to browser's local storage (key: `yuc-eco-mode-override`)
- Automatically restored on page reload

### Singleton Service
The `WebEcoModeCoreAnalyzerService` is provided at root level (`providedIn: 'root'`), ensuring a single instance is shared across the entire Angular application. This guarantees consistent state management.

## 📚 Documentation

- [Core Library Documentation](./libs/web-eco-mode-core/README.md)
- [Angular Library Documentation](./libs/web-eco-mode-angular/README.md)

## 🌐 Browser Support

### Battery Status API
- ✅ Chrome/Edge (Chromium-based)
- ⚠️ Limited support in other browsers
- The library gracefully handles unsupported APIs

### Network Information API
- ✅ Chrome/Edge (Chromium-based)
- ⚠️ Limited support in other browsers
- Falls back to basic online/offline detection

## 🛠️ Tech Stack

- **TypeScript**: Type-safe development
- **Angular 20+**: Modern Angular with standalone components and signals
- **RxJS 7+**: Reactive programming with observables
- **Nx**: Monorepo management and build tools
- **Jest**: Unit testing
- **Cypress**: E2E testing

## 📋 Requirements

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Angular**: 20.1.0 or higher (for Angular library)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🔗 Useful Resources

- [Battery Status API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API)
- [Network Information API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular Documentation](https://angular.dev/)
- [Nx Documentation](https://nx.dev/)

---

Built with 💚 by Younited | Powered by Nx
