import { Observable, fromEvent, merge, startWith, map, shareReplay } from 'rxjs';
import { NavigatorWithConnection, NetworkInformation, NetworkQualityResult } from './models';

export class NetworkAnalyzer {

  /**
   * Gets a real-time stream of network quality that updates automatically
   * when network conditions change (connection type, online/offline status, etc.)
   * @returns An Observable that emits network quality updates
   */
  getNetworkQuality$(): Observable<NetworkQualityResult> {
    const connection = this.getNetworkConnection();

    if (!connection) {
      // No Network Information API support, fall back to online/offline events only
      return this.getNetworkQualityWithoutConnectionAPI$();
    }

    // Listen to network connection changes
    const change$ = new Observable<Event>(observer => {
      const handler = (event: Event) => observer.next(event);
      connection.addEventListener?.('change', handler);
      return () => connection.removeEventListener?.('change', handler);
    });
    const onlineChange$ = fromEvent(globalThis, 'online');
    const offlineChange$ = fromEvent(globalThis, 'offline');

    return merge(change$, onlineChange$, offlineChange$).pipe(
      startWith(null), // Emit immediately with current values
      map(() => this.calculateNetworkQuality()),
      shareReplay(1) // Cache the latest value for new subscribers
    );
  }

  /**
   * Fallback for browsers without Network Information API
   */
  private getNetworkQualityWithoutConnectionAPI$(): Observable<NetworkQualityResult> {
    const onlineChange$ = fromEvent(globalThis, 'online');
    const offlineChange$ = fromEvent(globalThis, 'offline');

    return merge(onlineChange$, offlineChange$).pipe(
      startWith(null), // Emit immediately with current values
      map(() => this.calculateNetworkQuality()),
      shareReplay(1)
    );
  }

  /**
   * Calculates the current network quality (extracted from original getNetworkQuality)
   */
  private calculateNetworkQuality(): NetworkQualityResult {
    const connection = this.getNetworkConnection();
    let score = 50; // Default starting score
    const details: NetworkQualityResult['details'] = {
      isOnline: navigator.onLine,
      assessment: 'Average'
    };

    // If offline, set score to 0 and skip connection details
    if (!navigator.onLine) {
      score = 0;
      details.assessment = this.getAssessmentFromScore(score);
      return {score, details};
    }

    if (connection) {
      this.populateConnectionDetails(connection, details);
      score = this.calculateScoreWithConnection(connection, score);
    } else {
      score = this.calculateScoreWithoutConnection(score, details);
    }

    // Ensure the score stays between 0 and 100
    score = Math.max(0, Math.min(100, score));
    details.assessment = this.getAssessmentFromScore(score);

    return {score, details};
  }

  private getNetworkConnection(): NetworkInformation | undefined {
    const nav = navigator as NavigatorWithConnection;
    return nav.connection || nav.mozConnection || nav.webkitConnection;
  }

  private populateConnectionDetails(
    connection: NetworkInformation,
    details: NetworkQualityResult['details']
  ): void {
    details.connectionType = connection.effectiveType || connection.type;
    details.downlinkSpeed = connection.downlink;
    details.rtt = connection.rtt;
  }

  private calculateScoreWithConnection(connection: NetworkInformation, score: number): number {
    score = this.adjustScoreByConnectionType(connection, score);
    score = this.adjustScoreByDownlinkSpeed(connection, score);
    score = this.adjustScoreByRtt(connection, score);
    return score;
  }

  private adjustScoreByConnectionType(connection: NetworkInformation, score: number): number {
    switch (connection.effectiveType) {
      case 'slow-2g':
        return score - 30;
      case '2g':
        return score - 20;
      case '3g':
        return score - 10;
      case '4g':
        return score + 10;
      case '5g':
        return score + 20;
      default:
        return score;
    }
  }

  private adjustScoreByDownlinkSpeed(connection: NetworkInformation, score: number): number {
    if (!connection.downlink) {
      return score;
    }

    if (connection.downlink < 1) {
      return score - 15;
    } else if (connection.downlink < 5) {
      return score - 5;
    } else if (connection.downlink < 10) {
      return score + 5;
    } else {
      return score + 15;
    }
  }

  private adjustScoreByRtt(connection: NetworkInformation, score: number): number {
    if (!connection.rtt) {
      return score;
    }

    if (connection.rtt > 500) {
      return score - 20;
    } else if (connection.rtt > 300) {
      return score - 10;
    } else if (connection.rtt > 100) {
      return score - 5;
    } else {
      return score + 10;
    }
  }

  private calculateScoreWithoutConnection(
    score: number,
    details: NetworkQualityResult['details']
  ): number {
    score = this.adjustScoreByPerformanceApi(score, details);

    if (!navigator.onLine) {
      return 0; // No connection
    }

    return score;
  }

  private adjustScoreByPerformanceApi(
    score: number,
    details: NetworkQualityResult['details']
  ): number {
    if (!globalThis.performance?.getEntriesByType) {
      return score;
    }

    const resources = globalThis.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    if (resources.length === 0) {
      return score;
    }

    const avgLoadTime = resources.reduce((total, resource) =>
      total + (resource.responseEnd - resource.startTime), 0) / resources.length;

    details.avgLoadTime = avgLoadTime;

    return this.adjustScoreByLoadTime(avgLoadTime, score);
  }

  private adjustScoreByLoadTime(avgLoadTime: number, score: number): number {
    if (avgLoadTime > 1000) {
      return score - 20;
    } else if (avgLoadTime > 500) {
      return score - 10;
    } else if (avgLoadTime > 200) {
      return score - 5;
    } else {
      return score + 10;
    }
  }

  private getAssessmentFromScore(score: number): string {
    if (score >= 80) {
      return 'Excellent';
    } else if (score >= 60) {
      return 'Good';
    } else if (score >= 40) {
      return 'Average';
    } else if (score >= 20) {
      return 'Poor';
    } else {
      return 'Very Poor';
    }
  }
}

