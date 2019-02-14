import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';

import { NotificationModule } from '@progress/kendo-angular-notification';

import { AppComponent } from './app.component';

import { HomeComponent } from './shared/views/home/home.component';
import { SharedModule } from './modules/shared.module';

import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as store from './shared/store';
import { Store, StoreModule } from '@ngrx/store';
import { reducers } from './shared/store/reducers';

import { HelpComponent } from './shared/views/help/help.component';
import { Error404Component } from './core/error404/error404.component';
import { ErrorPageComponent } from './core/error-page/error-page.component';
import { AuthService } from './shared/services/initialize.service';
import { environment } from '../environments/environment';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { IdentityService } from './shared/services/identity.service';
import { BrowserModule } from '@angular/platform-browser';
import { LoaderComponent } from './core/loader/loader.component';
import { LoaderInterceptorService } from './shared/interceptors/loader-interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DocComponent } from './doc.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, HelpComponent, Error404Component, ErrorPageComponent, LoaderComponent, DocComponent],
  exports: [Error404Component],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NotificationModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: false,
    }),
    EffectsModule.forRoot(store.effects),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      name: '**** App',
      maxAge: 15,
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthService],
      },
    }),
  ],
  providers: [
    AuthService,
    IdentityService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: authFactory,
      deps: [AuthService, IdentityService, Store],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function jwtOptionsFactory(auth: AuthService) {
  return {
    tokenGetter: () => {
      return auth.getAccessToken().then();
    },
    throwNoTokenError: true,
    skipWhenExpired: true,
    whitelistedDomains: environment.whitelist,
    blacklistedRoutes: environment.blacklist,
  };
}

/**
 *
 * translation
 */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function authFactory(auth: AuthService) {
  return () => auth.initialiseApp();
}
