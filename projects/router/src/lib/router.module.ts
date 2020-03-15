import { NgModule, ModuleWithProviders } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

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
export class RouterModule {

  static forRoot(): ModuleWithProviders<RouterModule> {
    return {
      ngModule: RouterModule,
      providers: [
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy }
      ]
    }
  }
}
