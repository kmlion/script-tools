import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './shared/views/help/help.component';
import { ErrorPageComponent } from './core/error-page/error-page.component';
import { AccessAdmin } from './shared/route-guards/access-admin';
import { Error404Component } from './core/error404/error404.component';
import { DocComponent } from './doc.component';

const routes: Routes = [
  {
    path: 'dashboard',
    redirectTo: '',
  },
  {
    path: '',
    loadChildren: './core/user/user.module#UserModule',
  },
  {
    path: 'admin',
    loadChildren: './core/admin/admin.module#AdminModule',
    canLoad: [AccessAdmin],
  },
  {
    path: 'help',
    component: HelpComponent,
    data: { state: 'help' },
  },
  {
    path: 'error',
    component: ErrorPageComponent,
    data: { state: 'error' },
  },
  {
    path: 'doc',
    component: DocComponent,
    data: { state: 'doc' },
  },
  {
    path: '**',
    component: Error404Component,
    data: { state: '404' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  // imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
  providers: [AccessAdmin],
})
export class AppRoutingModule {}
