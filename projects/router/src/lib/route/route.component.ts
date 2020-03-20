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

import { tap, distinctUntilChanged, filter } from "rxjs/operators";
import { RouteParams } from '../route-params.service';

@Component({
  selector: "route",
  template: `
    <div #outlet></div>
  `
})
export class RouteComponent implements OnInit {
  @ViewChild("outlet", { read: ElementRef, static: true }) outlet: ElementRef;
  @Input() path: string;
  @Input() component: Type<any>;
  @Input() loadComponent: LoadComponent;
  route!: Route<any>;
  rendered = null;

  constructor(private injector: Injector, private router: RouterComponent) {}

  ngOnInit(): void {
    // account for root level routes, don't add the basePath
    const path = this.router.parentRouterComponent ? this.router.basePath + this.path : this.path;

    this.route = this.router.registerRoute({
      path,
      component: this.component,
      loadComponent: this.loadComponent
    });

    this.router.activeRoute$
      .pipe(
        distinctUntilChanged(),
        tap(current => {
          if (!this.rendered && current === this.route) {
            this.loadAndRenderRoute(current);
          } else if (this.rendered) {
            this.clearView();
          }
        })
      )
      .subscribe();
  }

  loadAndRenderRoute(route: Route<any>) {
    if (route.loadComponent) {
      route.loadComponent().then(component => {
        this.renderView(component, this.outlet.nativeElement);
      });
    } else {
      this.renderView(
        route.component,
        this.outlet.nativeElement
      );
    }
  }

  renderView(component: Type<any>, host: any) {
    const cmpInjector = createInjector({}, this.injector, [
      { provide: RouteParams, useValue: this.router.routeParams$ }
    ])
    this.rendered = renderComponent(component, {
      host,
      injector: cmpInjector
    });
    this.router.routeParams$.pipe(
      filter(() => !!this.rendered),
      tap(() => markDirty(this.rendered))
    ).subscribe();
  }

  clearView() {
    this.outlet.nativeElement.innerHTML = "";
    this.rendered = null;
  }
}
