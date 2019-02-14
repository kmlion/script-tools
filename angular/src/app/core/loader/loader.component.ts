import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService, LoaderState } from '../../shared/interceptors/loader-interceptor';

@Component({
  selector: '****',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnDestroy {
  public show = false;
  private subscription: Subscription;

  constructor(private loaderService: LoaderService) {}

  public ngOnInit() {
    this.subscription = this.loaderService.loaderState.subscribe((state: LoaderState) => {
      this.show = state.show;
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
