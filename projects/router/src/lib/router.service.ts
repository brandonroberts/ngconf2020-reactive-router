import { Injectable, Inject } from '@angular/core';
import { Location, PlatformLocation } from '@angular/common';

import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { URL_PARSER, UrlParser } from './url-parser';

@Injectable({
  providedIn: 'root'
})
export class Router {
  private _url$ = new BehaviorSubject<string>(this.getLocation());
  url$ = this._url$.pipe(distinctUntilChanged());

  private _queryParams$ = new BehaviorSubject({});
  queryParams$ = this._queryParams$.pipe(distinctUntilChanged());
  
  private _hash$ = new BehaviorSubject('');
  hash$ = this._hash$.pipe(distinctUntilChanged());

  constructor(
    private location: Location,
    private platformLocation: PlatformLocation,
    @Inject(URL_PARSER) private urlParser: UrlParser
  ) {
    this.location.onUrlChange(() => {
      this.nextState(this.getLocation());
    });

    this.location.subscribe(() => {
      this.nextState(this.getLocation());
    });

    this.nextState(this.getLocation());
  }

  go(url: string, queryParams?: string) {
    this.location.go(this.location.prepareExternalUrl(url), queryParams);
  }

  getExternalUrl(url: string) {
    return this.location.prepareExternalUrl(url);
  }

  private getLocation() {
    return this.platformLocation.href;
  }

  private nextState(path: string) {
    const parsedUrl = this._parseUrl(path);
    this._nextUrl(parsedUrl.pathname);
    this._nextQueryParams(parsedUrl.searchParams);
    this._nextHash(parsedUrl.hash ? parsedUrl.hash.split('#')[0] : '');
  }

  private _parseUrl(path: string): URL {
    return this.urlParser(path);
  }

  private _nextUrl(url: string) {
    this._url$.next(this.location.normalize(url));
  }

  private _nextQueryParams(params: URLSearchParams) {
    this._queryParams$.next(params);
  }

  private _nextHash(hash: string) {
    this._hash$.next(hash);
  }
}
