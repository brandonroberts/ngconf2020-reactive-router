import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  HomeComponent = HomeComponent;
  AboutComponent = AboutComponent;

  constructor(private location: Location) {}

  goHome() {
    this.location.go('/');
  }

  goAbout() {
    this.location.go('/about');
  }
}
