import { NgModule } from '@angular/core';
import { RouterComponent } from './router.component';
import { RouteComponent } from './route/route.component';
import { LinkTo } from './link/link.component';

const components = [
  RouterComponent,
  RouteComponent,
  LinkTo
];

@NgModule({
  declarations: [components],
  imports: [],
  exports: [components]
})
export class RouterModule {}
