import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { Router } from '@ngconf/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  HomeComponent = HomeComponent;
  AboutComponent = AboutComponent;

  constructor(private router: Router) {}

  goHome() {
    this.router.go('/');
  }

  goAbout() {
    this.router.go('/about');
  }
}
