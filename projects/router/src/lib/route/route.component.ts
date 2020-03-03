import { Component, OnInit, Input, Type } from '@angular/core';

@Component({
  selector: 'lib-route',
  template: `
    <p>
      route works!
    </p>
  `,
  styles: []
})
export class RouteComponent implements OnInit {
  @Input() path: string;
  @Input() component: Type<any>;
  
  constructor() { }

  ngOnInit(): void {
  }

}
