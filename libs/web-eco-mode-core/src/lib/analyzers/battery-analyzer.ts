import { Observable, fromEvent, merge, startWith, switchMap, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import { BatteryInfo, BatteryManager, NavigatorWithBattery } from './models';

// Interface for battery information


export class BatteryAnalyzer {

  /**
   * Gets a real-time stream of battery information that updates automatically
   * when battery status changes (charging, level, etc.)
   * @returns An Observable that emits battery info updates
   */
  getBatteryInfo$(): Observable<BatteryInfo> {
    const nav = navigator as NavigatorWithBattery;

    if (!nav.getBattery) {
      return new Observable(observer => {
        observer.next({ supported: false });
        observer.complete();
      });
    }

    const getBattery = nav.getBattery.bind(nav);

    return new Observable<BatteryManager>(observer => {
      getBattery()
        .then(battery => {
          observer.next(battery);
        })
        .catch(() => {
          observer.error(new Error('Battery API not available'));
        });
    }).pipe(
      switchMap(battery => {
        // Listen to all battery events
        const chargingChange$ = fromEvent(battery, 'chargingchange');
        const levelChange$ = fromEvent(battery, 'levelchange');
        const chargingTimeChange$ = fromEvent(battery, 'chargingtimechange');
        const dischargingTimeChange$ = fromEvent(battery, 'dischargingtimechange');

        // Merge all events and emit current battery info
        return merge(
          chargingChange$,
          levelChange$,
          chargingTimeChange$,
          dischargingTimeChange$
        ).pipe(
          startWith(null), // Emit immediately with current values
          map(() => this.mapBatteryManagerToInfo(battery))
        );
      }),
      shareReplay(1) // Cache the latest value for new subscribers
    );
  }

  private mapBatteryManagerToInfo(battery: BatteryManager): BatteryInfo {
    return {
      supported: true,
      charging: battery.charging,
      chargingTime: battery.chargingTime === Infinity ? undefined : battery.chargingTime,
      dischargingTime: battery.dischargingTime === Infinity ? undefined : battery.dischargingTime,
      level: battery.level,
      levelPercentage: Math.round(battery.level * 100)
    };
  }
}

