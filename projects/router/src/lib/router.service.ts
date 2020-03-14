import { Injectable, Injector } from '@angular/core';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  private _url$ = new BehaviorSubject(this.location.path(true));
  url$ = this._url$.asObservable();

  constructor(private location: Location, private injector: Injector) {
    this.location.onUrlChange(url => {
      this._url$.next(this.location.normalize(url));
    });
    this.location.subscribe(state => {
      this._url$.next(this.location.normalize(state.url || ''));
    });
  }
}
