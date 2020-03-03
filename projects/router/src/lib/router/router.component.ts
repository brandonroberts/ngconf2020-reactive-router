import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { RouteComponent } from '../route/route.component';

@Component({
  selector: 'router',
  template: '',
  styles: []
})
export class RouterComponent implements OnInit {
  @ViewChildren(RouteComponent) routes: QueryList<RouteComponent>;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log(this.routes)
  }

}
