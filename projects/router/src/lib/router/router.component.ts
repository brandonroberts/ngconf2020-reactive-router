import {
  Component,
  ViewChild,
  ElementRef,
  ɵrenderComponent as renderComponent,
  Injector,
  Type
} from "@angular/core";
import { Location } from "@angular/common";
import { match } from "path-to-regexp";

import { combineLatest, Subject } from "rxjs";
import { tap, takeUntil, distinctUntilChanged } from "rxjs/operators";

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
  private lastMatch: RegExpExecArray | false;

  constructor(
    private router: Router,
    private injector: Injector,
    private routeParams: RouteParams
  ) {}

  ngOnInit() {
    combineLatest(this.router.routes$, this.router.url$)
      .pipe(
        takeUntil(this.destroy$),
        tap(([routes, url]) =>
          routes.forEach(route => {
            const matchedRoute = route.matcher
              ? route.matcher.exec(url)
              : false;

            if (matchedRoute) {
              const pathInfo = match(route.path)(url);

              const routeParams = pathInfo ? pathInfo.params : {};
              this.routeParams.next(routeParams || {});

              if (matchedRoute !== this.lastMatch) {
                this.lastMatch = matchedRoute;

                if (route.loadComponent) {
                  route.loadComponent().then(component => {
                    this.renderView(
                      component,
                      this.outlet.nativeElement,
                      this.injector
                    );
                  });
                } else {
                  this.renderView(
                    route.component,
                    this.outlet.nativeElement,
                    this.injector
                  );
                }
              }
            }
          })
        )
      )
      .subscribe();
  }

  renderView(component: Type<any>, host: any, injector?: Injector) {
    renderComponent(component, {
      host,
      injector
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
