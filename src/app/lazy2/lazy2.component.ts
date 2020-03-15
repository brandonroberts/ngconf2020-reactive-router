import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@ngconf/router';

@Component({
  selector: 'app-lazy',
  templateUrl: './lazy.component.html',
  styleUrls: ['./lazy.component.css'],
})
export class Lazy2Component implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [Lazy2Component],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class LazyModule { }
