import {
  Component,
  OnInit,
  Input,
  Type,
  Injector,
  ɵrenderComponent as renderComponent,
  ElementRef,
  ViewChild
} from "@angular/core";
import { tap, distinctUntilChanged } from "rxjs/operators";
import { Location } from "@angular/common";
import { RouterComponent } from "../router/router.component";

@Component({
  selector: "route",
  template: "<div #outlet></div>"
})
export class RouteComponent implements OnInit {
  @ViewChild("outlet", { read: ElementRef, static: true }) outlet: ElementRef;
  @Input() path: string;
  @Input() component: Type<any>;
  private rendered = false;

  constructor(
    private injector: Injector,
    private router: RouterComponent,
    private location: Location
  ) {}

  @Input() set render(shouldRender: boolean) {
    if (shouldRender && !this.rendered) {
      this.rendered = renderComponent(this.component, {
        host: this.outlet.nativeElement,
        injector: this.injector
      });
    } else if (!shouldRender && this.rendered) {
      if (this.outlet.nativeElement.children) {
        Array.from(this.outlet.nativeElement.children).forEach(child =>
          this.outlet.nativeElement.removeChild(child)
        );
        this.rendered = null;
      }
    }
  }

  ngOnInit(): void {
    this.router.url$
      .pipe(
        distinctUntilChanged(),
        tap(url => {
          this.render = url === this.location.normalize(this.path);
        })
      )
      .subscribe();
  }
}
