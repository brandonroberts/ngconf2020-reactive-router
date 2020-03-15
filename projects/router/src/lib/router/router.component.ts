import {
  Component,
  ViewChild,
  ElementRef,
  ɵrenderComponent as renderComponent,
  Injector
} from "@angular/core";
import { Location } from "@angular/common";
import { match } from "path-to-regexp";

import { combineLatest, Subject } from "rxjs";
import { tap, takeUntil } from "rxjs/operators";

import { Router } from "../router.service";
import { RouteParams } from "../route-params.service";

@Component({
  selector: "router",
  template: `
    <ng-content></ng-content>
    <div #outlet></div>
  `
})
export class RouterComponent {
  @ViewChild("outlet", { read: ElementRef, static: true }) outlet: ElementRef;

  private destroy$ = new Subject();

  constructor(
    private router: Router,
    private injector: Injector,
    private location: Location,
    private routeParams: RouteParams
  ) {}

  ngOnInit() {
    combineLatest(this.router.routes$, this.router.url$)
      .pipe(
        takeUntil(this.destroy$),
        tap(([routes, url]) =>
          routes.forEach(route => {
            const matchedRoute = route.matcher
              ? route.matcher.exec(this.location.normalize(url))
              : false;

            if (matchedRoute) {
              const pathInfo = match(route.path)(url);

              const routeParams = pathInfo ? pathInfo.params : {};
              this.routeParams.next(routeParams || {});

              renderComponent(route.component, {
                host: this.outlet.nativeElement,
                injector: this.injector
              });
            }
          })
        )
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
