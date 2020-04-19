import { NgModule, ModuleWithProviders } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

import { RouterComponent } from './router.component';
import { RouteComponent } from './route.component';
import { LinkTo } from './link.component';

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
