import { fromEvent, interval, merge, NEVER, Observable } from "rxjs";
import { mapTo, scan, startWith, switchMap, tap } from "rxjs/operators";

interface State {
  count: boolean;
  value: number;
}

const initalState: State = {
  count: false,
  value: 0,
};

export class StopWatch {
  private _clock = document.querySelector("#clock")!;

  events$: Observable<Partial<State>> = merge(
    this.fromClickMapTo("#start", { count: true }),
    this.fromClickMapTo("#pause", { count: false }),
    this.fromClickMapTo("#reset", { value: 0 })
  );

  constructor() {
    this.init();
  }

  // TODO ⏲
  private init() {
    this.events$.pipe(tap((e) => console.log(e))).subscribe();
  }

  private fromClickMapTo(
    querySelector: string,
    payload: Partial<State>
  ): Observable<Partial<State>> {
    return fromEvent(document.querySelector(querySelector)!, "click").pipe(
      mapTo(payload)
    );
  }

  /**
   * Set clock value
   * @param value in ms
   */
  set clock(value: number) {
    const centiSeconds = Math.trunc((value % 1000) / 10)
      .toString()
      .padStart(2, "0");
    const seconds = Math.trunc((value / 1000) % 60)
      .toString()
      .padStart(2, "0");
    const minutes = Math.trunc(value / 1000 / 60)
      .toString()
      .padStart(2, "0");
    this._clock.textContent = `${minutes}:${seconds}:${centiSeconds}`;
  }
}
