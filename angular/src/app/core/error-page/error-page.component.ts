import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: '*****-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
})
export class ErrorPageComponent implements OnInit {
  constructor(private activeRoute: ActivatedRoute) {}

  public message: string;

  public ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      this.message = params.msg || null;
    });
  }
}
