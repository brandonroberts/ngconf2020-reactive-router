import { Injectable, Type } from '@angular/core';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { scan, distinctUntilChanged } from 'rxjs/operators';
import { pathToRegexp } from "path-to-regexp";

export interface Route {
  path: string;
  component: Type<any>;
  matcher?: RegExp;
}

@Injectable({
  providedIn: 'root'
})
export class Router {
  private _url$ = new BehaviorSubject(window.location.href);
  url$ = this._url$.pipe(distinctUntilChanged());

  private _queryParams$ = new BehaviorSubject({});
  queryParams$ = this._queryParams$.pipe(distinctUntilChanged());
  
  private _hash$ = new BehaviorSubject('');
  hash$ = this._hash$.pipe(distinctUntilChanged());

  private _routes$ = new BehaviorSubject<Route[]>([]);
  routes$ = this._routes$.pipe(scan((routes, route) => {
    routes = routes.concat(route);
    routes.sort((a, b) => a.path.length > b.path.length ? 1 : 0)
    return routes;
  }));

  constructor(private location: Location) {
    this.location.onUrlChange(() => {
      this.nextState(window.location.href);
    });
    this.location.subscribe(() => {
      this.nextState(window.location.href);
    });

    this.nextState(window.location.href);
  }

  go(url: string, queryParams?: string) {
    this.location.go(this.location.prepareExternalUrl(url), queryParams);
  }

  getExternalUrl(url: string) {
    this.location.prepareExternalUrl(url);
  }

  private nextState(path: string) {
    const parsedUrl = this._parseUrl(path);
    this._nextUrl(parsedUrl.pathname);
    this._nextQueryParams(parsedUrl.searchParams);
    this._nextHash(parsedUrl.hash ? parsedUrl.hash.split('#')[0] : '');
  }

  private _parseUrl(path: string): URL {
    return new URL(path);
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

  registerRoute(route: Route) {
    const routeRegex = pathToRegexp(this.location.normalize(route.path));
    route.matcher = route.matcher || routeRegex;
    this._routes$.next([route]);
  }
}
