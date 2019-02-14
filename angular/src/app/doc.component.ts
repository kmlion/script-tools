import { Component } from '@angular/core';

@Component({
  selector: '****-doc',
  template: `
    <a href="/doc/index.html">GO TO DOC</a>
  `,
})
export class DocComponent {
  constructor() {
   window.document.location.href = window.document.location.origin + '../../documentation/index.html';
  }
}
