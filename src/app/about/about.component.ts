import { Component, OnInit} from '@angular/core';
import { RouteParams, Router } from '@ngconf/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  me$ = this.routeParams$.pipe(map(params => params['me']));

  constructor(private routeParams$: RouteParams, router: Router) {
    router.url$.subscribe(url => { console.log('rurl', url);});
    router.queryParams$.subscribe(qp => { console.log('rqp', qp);});
    router.hash$.subscribe(hash => { console.log('rh', hash);});
  }

  ngOnInit(): void {
    // console.log('on', this.routeParams);
  }

  ngAfterViewInit() {
    // console.log('after', this.routeParams);
  }
}
