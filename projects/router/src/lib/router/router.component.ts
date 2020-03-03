import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { RouteComponent } from '../route/route.component';

@Component({
  selector: 'lib-router',
  template: `
    <p>
      router works!
    </p>
  `,
  styles: []
})
export class RouterComponent implements OnInit {
  @ViewChildren(RouteComponent, { read: RouteComponent }) routes: QueryList<RouteComponent>;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log(this.routes)
  }

}
