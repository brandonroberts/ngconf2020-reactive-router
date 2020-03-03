import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-link',
  template: `
    <p>
      link works!
    </p>
  `,
  styles: []
})
export class LinkComponent implements OnInit {
  @Input() to: string;

  constructor() { }

  ngOnInit(): void {
  }

}
