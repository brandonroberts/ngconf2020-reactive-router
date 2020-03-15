import { Component, SkipSelf, Optional } from "@angular/core";
import { Location } from "@angular/common";
import { match } from "path-to-regexp";

import { combineLatest, Subject, BehaviorSubject } from "rxjs";
import { tap, takeUntil, distinctUntilChanged, scan } from "rxjs/operators";

import { Router, Route } from "../router.service";
import { RouteParams } from "../route-params.service";
import { pathToRegexp } from "path-to-regexp";

@Component({
  selector: "router",
  template: `
    <ng-content></ng-content>
  `
})
export class RouterComponent {
  private destroy$ = new Subject();
  private _activeRoute$ = new BehaviorSubject<Route<any>>(null);
  activeRoute$ = this._activeRoute$.pipe(distinctUntilChanged());

  private _routes$ = new BehaviorSubject<Route<any>[]>([]);
  routes$ = this._routes$.pipe(
    scan((routes, route) => {
      routes = routes.concat(route);
      routes.sort((a, b) => (a.path.length > b.path.length ? 1 : 0));

      return routes;
    })
  );

  public basePath = "";

  // support multiple "routers"
  // router (base /)
  // blog(.*?)
  // router (base /blog)
  // post1(blog/post1/(.*?)
  // post2
  // post3

  constructor(
    private router: Router,
    private location: Location,
    private routeParams: RouteParams,
    @SkipSelf() @Optional() private parentRouterComponent: RouterComponent
  ) {}

  ngOnInit() {
    if (this.parentRouterComponent) {
      this.basePath = `${this.parentRouterComponent.basePath}${this.basePath}`;
    }

    combineLatest(this.routes$, this.router.url$)
      .pipe(
        takeUntil(this.destroy$),
        tap(([routes, url]: [Route<any>[], string]) => {
          for (const route of routes) {
            const matchedRoute = route.matcher
              ? route.matcher.exec(url) : false;
            // const pathInfo = match(route.path)(url);

            if (matchedRoute) {
              const pathInfo = match(route.path)(url);
              this.basePath = pathInfo ? pathInfo.path : this.basePath || route.path;

              const routeParams = pathInfo ? pathInfo.params : {};
              this.setActiveRoute(route);
              this.routeParams.next(routeParams || {});

              break;
            }
          }
        })
      )
      .subscribe();
  }

  registerRoute<T>(route: Route<T>) {
    const normalizedPath = this.location.normalize(route.path);
    const routeRegex = pathToRegexp(normalizedPath);
    route.matcher = route.matcher || routeRegex;
    this._routes$.next([route]);
    return route;
  }

  setActiveRoute<T>(route: Route<T>) {
    this._activeRoute$.next(route);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
