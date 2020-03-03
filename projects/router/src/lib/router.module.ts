import { NgModule } from '@angular/core';
import { RouterComponent } from './router.component';
import { RouteComponent } from './route/route.component';
import { LinkComponent } from './link/link.component';

const components = [
  RouterComponent,
  RouteComponent,
  LinkComponent
];

@NgModule({
  declarations: [],
  imports: [components],
  exports: [components]
})
export class RouterModule {}
