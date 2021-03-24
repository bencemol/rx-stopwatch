import { fromEvent, interval, merge, Observable, of } from 'rxjs';
import { mapTo, scan, switchMap, tap, map } from 'rxjs/operators';

interface State {
  count: boolean;
  value: number;
  direction: number;
}

const initalState: State = {
  count: false,
  value: 0,
  direction: 1,
};

export class StopWatch {
  private _clock = document.querySelector('#clock')!;

  events$: Observable<Partial<State>> = merge(
    this.fromClickMapTo('#start', { count: true, direction: 1 }),
    this.fromClickMapTo('#revert', { count: true, direction: -1 }),
    this.fromClickMapTo('#pause', { count: false }),
    this.fromClickMapTo('#reset', { value: 0 }),
    this.fromClickSetTime('#set-time', '#input-time'),
    this.fromClickAddLap('#lap')
  );

  constructor() {
    this.init();
  }

  private init() {
    this.events$
      .pipe(
        scan(
          (state: State, payload: Partial<State>) => ({
            ...state,
            ...payload
          }),
          initalState
        ),
        tap(console.log),
        switchMap((state: State) =>
          state.count
            ? interval(10).pipe(
                tap(() => (state.value += 10 * state.direction)),
                tap(() => this.resetValueIfNegative(state)),
                mapTo(state)
              )
            : of(state)
        ),
        tap((state: State) => (this.clock = state.value))
      )
      .subscribe();

  }

  private fromClickMapTo(
    querySelector: string,
    payload: Partial<State>
  ): Observable<Partial<State>> {
    return fromEvent(document.querySelector(querySelector)!, 'click').pipe(
      mapTo(payload)
    );
  }

  private fromClickSetTime(
    buttonQuerySelector : string,
    inputQuerySelector : string): Observable<Partial<State>> {
    return fromEvent(document.querySelector(buttonQuerySelector)!, 'click')    
      .pipe(
        map(() => {
          if(new RegExp('^[0-9]{2}:[0-5][0-9]:[0-9]{2}$').test((<HTMLInputElement>document.querySelector(inputQuerySelector)!).value as string)){
            return {value: this.stringTimeToMs((<HTMLInputElement>document.querySelector(inputQuerySelector)!).value)};
          }
          alert("Does this look like a proper time format for ya? err")
          return {};
        }),
      )
  }

  private fromClickAddLap(
    querySelector : string,
    ): Observable<Partial<State>> {
    return  fromEvent(document.querySelector(querySelector)!, 'click').pipe(
      tap(() => addItem(this._clock.textContent)),
      map(() => {return {};})
    )
  }


  /**
   * Set clock value
   * @param value in ms
   */
  set clock(value: number) {
    const centiSeconds = Math.trunc((value % 1000) / 10)
      .toString()
      .padStart(2, '0');
    const seconds = Math.trunc((value / 1000) % 60)
      .toString()
      .padStart(2, '0');
    const minutes = Math.trunc(value / 1000 / 60)
      .toString()
      .padStart(2, '0');
    this._clock.textContent = `${minutes}:${seconds}:${centiSeconds}`;
  }

  private stringTimeToMs(value: string): number{
    const values = value.split(":");
    const minutes = Number(values[0]) * 60000;
    const seconds = Number(values[1]) * 1000;
    const centiSeconds = Number(values[2]) * 10;
    console.log(minutes + seconds + centiSeconds);
    return minutes + seconds + centiSeconds;
  }

  private resetValueIfNegative(state: State): void{
      if(state.value < 0){
        state.value  = 0;
      }
  }
}

function addItem(val:any){
  var node = document.createElement("li");
  var textnode = document.createTextNode(val);
  node.appendChild(textnode);
  document.getElementById("laps")?.appendChild(node);
}