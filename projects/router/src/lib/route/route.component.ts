import { Component, OnInit, Input, Type, Injector, ɵrenderComponent as renderComponent, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'route',
  template: '<div #outlet></div>'
})
export class RouteComponent implements OnInit {
  @ViewChild('outlet', { read: ElementRef, static: true }) outlet: ElementRef;
  @Input() path: string;
  @Input() component: Type<any>;
  private rendered: any;

  constructor(private location: Location, private injector: Injector) {
    this.location.onUrlChange(url => {
      this.shouldRender(url);
    });
  }

  ngOnInit(): void {
    this.shouldRender(this.location.path());
  }

  shouldRender(url: string) {
    if (!this.rendered && this.location.normalize(url) === this.location.normalize(this.path)) {
      this.rendered = renderComponent(this.component, {
        host: this.outlet.nativeElement,
        injector: this.injector,
      });
    } else {
      if (this.outlet.nativeElement.children) {
        Array.from(this.outlet.nativeElement.children).forEach(child => this.outlet.nativeElement.removeChild(child));
        this.rendered = null;
      }
    }    
  }
}
