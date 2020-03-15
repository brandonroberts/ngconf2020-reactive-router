import { Component, OnInit, Input, Type } from "@angular/core";
import { Router } from "../router.service";

@Component({
  selector: "route",
  template: ""
})
export class RouteComponent implements OnInit {
  @Input() path: string;
  @Input() component: Type<any>;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.registerRoute({ path: this.path, component: this.component });
  }
}
