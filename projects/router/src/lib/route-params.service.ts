import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Params {
  [param: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class RouteParams extends BehaviorSubject<Params> {
  constructor() {
    super({});
  }
}