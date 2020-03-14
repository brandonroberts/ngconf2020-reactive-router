import { NgModule } from '@angular/core';
import { RouterComponent } from './router/router.component';
import { RouteComponent } from './route/route.component';
import { LinkTo } from './link/link.component';

const components = [
  RouterComponent,
  RouteComponent,
  LinkTo
];

@NgModule({
  declarations: [components],
  exports: [components]
})
export class RouterModule {}
