import { AfterViewInit, Component } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { select, Store } from '@ngrx/store';
import { IBaseState } from './shared/interfaces/base-state';
import { getApiErrors, getInitErrors, hasAdminOnlyRole } from './shared/store/selectors';
import { first } from 'rxjs/operators';
import { ClearApiErrors } from './shared/store';
import { NavigationStart, Router } from '@angular/router';
import { environment } from '../environments/environment';
import { fadeAnimation } from './shared/animations/fadeAnimation';

@Component({
  selector: '****-root',
  templateUrl: './app.component.html',
  animations: [fadeAnimation],
})
export class AppComponent implements AfterViewInit {
  constructor(private notificationService: NotificationService, private store: Store<IBaseState>, private router: Router) {}

  public ngAfterViewInit() {
    // Show errors which occured during Initilisation
    setTimeout(() => {
      this.store
        .pipe(select(getInitErrors))
        .pipe(first())
        .subscribe((errors) => {
          if (environment.production && errors.length > 0) {
            this.router.navigate(['/error', { msg: 'Failed to retrieve all critical data required to load application' }]);
            // this.router.navigate(['/error']);
          } else if (errors.length > 0) {
            this.printErrors(errors.reverse());
          }
        });
    }, 500);

    this.store.pipe(select(getApiErrors)).subscribe((errors) => {
      if (environment.production && errors.length > 0) {
        this.router.navigate(['/error']);
        this.store.dispatch(new ClearApiErrors());
      } else if (errors.length > 0) {
        this.printErrors(errors.reverse());
        this.store.dispatch(new ClearApiErrors());
      }

      errors.forEach((error) => {
        this.notificationService.show({
          content: error,
          position: { horizontal: 'right', vertical: 'bottom' },
          animation: { type: 'fade', duration: 500 },
          hideAfter: 10000,
          type: { style: 'warning', icon: true },
        });
      });
      if (errors.length > 0) {
        this.store.dispatch(new ClearApiErrors());
      }
    });

    // Redirect to Admin Section if user has ADMIN roles AND is root url (/)
    this.router.events.pipe(first()).subscribe((event) => {
      if (event instanceof NavigationStart && event.url === '/') {
        this.store.pipe(select(hasAdminOnlyRole)).subscribe((adminOnly) => {
          if (adminOnly) {
            this.router.navigate(['/admin']);
          }
        });
      }
    });
  }

  private printErrors(errArray) {
    errArray.forEach((error) => {
      this.notificationService.show({
        content: error,
        position: { horizontal: 'right', vertical: 'bottom' },
        animation: { type: 'fade', duration: 500 },
        hideAfter: 10000,
        type: { style: 'error', icon: true },
      });
    });
  }
  public getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
