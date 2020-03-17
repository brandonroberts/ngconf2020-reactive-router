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
    @SkipSelf() @Optional() public parentRouterComponent: RouterComponent
  ) {}

  ngOnInit() {
    combineLatest(this.routes$, this.router.url$)
      .pipe(
        takeUntil(this.destroy$),
        tap(([routes, url]: [Route<any>[], string]) => {
          let routeToRender = null;
          for (const route of routes) {
            routeToRender = this.findRouteMatch(route, url);

            if (routeToRender) {
              this.setRoute(url, route, routeToRender);
              break;
            }
          }

          if (!routeToRender) {
            this.setActiveRoute(null);
          }
        })
      )
      .subscribe();
  }

  findRouteMatch(route: Route<any>, url: string) {
    let matchedRoute = route.matcher ? route.matcher.exec(url) : null;

    if (matchedRoute) {
      return matchedRoute;
    }

    // check to see if a greedy match will find something
    const secondaryMatch = pathToRegexp(`${route.path}(.*)`);
    const secondaryMatchedRoute = secondaryMatch.exec(url);

    if (secondaryMatchedRoute) {
      return secondaryMatchedRoute;
    }
  }

  setRoute(url: string, route: Route<any>, matchedRoute: RegExpExecArray) {
    const useRoute = matchedRoute;
    const pathInfo = match(route.path)(url);
    this.basePath = useRoute[0] || "/";

    const routeParams = pathInfo ? pathInfo.params : {};
    this.setActiveRoute(route);
    this.routeParams.next(routeParams || {});
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
