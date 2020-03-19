import {
  Component,
  OnInit,
  Input,
  Type,
  ViewChild,
  ElementRef,
  Injector,
  ɵrenderComponent as renderComponent,
  ChangeDetectorRef
} from "@angular/core";
import { LoadComponent, Route } from "../router.service";
import { RouterComponent } from "../router/router.component";

import { tap, distinctUntilChanged } from "rxjs/operators";

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
  params$ = this.router.routeParams$.pipe(tap(console.log));

  constructor(private injector: Injector, private router: RouterComponent, private ref: ChangeDetectorRef) {}

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
        this.renderView(component, this.outlet.nativeElement, this.injector);
      });
    } else {
      this.renderView(
        route.component,
        this.outlet.nativeElement,
        this.injector
      );
    }
  }

  renderView(component: Type<any>, host: any, injector?: Injector) {
    this.rendered = renderComponent(component, {
      host,
      injector
    });
  }

  clearView() {
    this.outlet.nativeElement.innerHTML = "";
    this.rendered = null;
  }
}
