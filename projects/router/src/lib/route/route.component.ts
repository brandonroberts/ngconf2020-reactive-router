import {
  Component,
  OnInit,
  Input,
  Type,
  ViewChild,
  ElementRef,
  Injector,
  ɵrenderComponent as renderComponent,
  ɵmarkDirty as markDirty,
  ɵcreateInjector as createInjector
} from "@angular/core";
import { LoadComponent, Route } from "../router.service";
import { RouterComponent } from "../router/router.component";

import { tap, distinctUntilChanged, filter, takeUntil } from "rxjs/operators";
import { RouteParams, Params } from "../route-params.service";
import { Subject, BehaviorSubject } from "rxjs";

@Component({
  selector: "route",
  template: `
    <div #outlet></div>
  `
})
export class RouteComponent implements OnInit {
  private destroy$ = new Subject();
  @ViewChild("outlet", { read: ElementRef, static: true }) outlet: ElementRef;
  @Input() path: string;
  @Input() component: Type<any>;
  @Input() loadComponent: LoadComponent;
  route!: Route<any>;
  rendered = null;
  private _routeParams$ = new BehaviorSubject<Params>({});
  routeParams$ = this._routeParams$.asObservable();

  constructor(private injector: Injector, private router: RouterComponent) {}

  ngOnInit(): void {
    // account for root level routes, don't add the basePath
    const path = this.router.parentRouterComponent
      ? this.router.basePath + this.path
      : this.path;

    this.route = this.router.registerRoute({
      path,
      component: this.component,
      loadComponent: this.loadComponent
    });

    this.router.activeRoute$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        tap(current => {
          if (current.route === this.route) {
            this._routeParams$.next(current.params);

            if (!this.rendered) {
              this.loadAndRenderRoute(current.route);
            }
          } else if (this.rendered) {
            this.clearView();
          }
        })
      )
      .subscribe();

    this._routeParams$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        filter(() => !!this.rendered),
        tap(() => markDirty(this.rendered))
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  loadAndRenderRoute(route: Route<any>) {
    if (route.loadComponent) {
      route.loadComponent().then(component => {
        this.renderView(component, this.outlet.nativeElement);
      });
    } else {
      this.renderView(route.component, this.outlet.nativeElement);
    }
  }

  renderView(component: Type<any>, host: any) {
    const cmpInjector = createInjector({}, this.injector, [
      { provide: RouteParams, useValue: this.routeParams$ }
    ]);

    this.rendered = renderComponent(component, {
      host,
      injector: cmpInjector
    });
  }

  clearView() {
    this.outlet.nativeElement.innerHTML = "";
    this.rendered = null;
  }
}
