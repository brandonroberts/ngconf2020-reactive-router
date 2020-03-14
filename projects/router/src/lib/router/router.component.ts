import { Component } from '@angular/core';
import { RouterService } from '../router.service';


@Component({
  selector: 'router',
  template: '<ng-content></ng-content>'
})
export class RouterComponent {
  url$ = this.router.url$;
 
  constructor(private router: RouterService) {}
}
