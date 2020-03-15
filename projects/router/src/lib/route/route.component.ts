import {
  Component,
  OnInit,
  Input,
  Type,
  ViewChild,
  ElementRef,
  Injector,
  ɵrenderComponent as renderComponent
} from "@angular/core";
import { LoadComponent, Route } from "../router.service";
import { RouterComponent } from "../router/router.component";

import { tap, filter } from "rxjs/operators";

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
    this.route = this.router.registerRoute({
      path: this.router.basePath + this.path,
      component: this.component,
      loadComponent: this.loadComponent
    });

    this.router.activeRoute$
      .pipe(
        filter(activeRoute => !!activeRoute),
        tap(currentRoute => {
          if (!this.rendered && currentRoute === this.route) {
            this.loadAndRenderRoute(currentRoute);
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
    Array.from(this.outlet.nativeElement.children).forEach(child => this.outlet.nativeElement.removeChild(child));
    this.rendered = null;
  }
}
