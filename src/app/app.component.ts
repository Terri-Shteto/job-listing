import { Component } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'job-listing';
  public user: User|null = null;

  constructor(private router: Router, private auth: Auth) {
  }

  protected ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      this.user = user;

      if (!user) {
        return this.router.navigate(['sign-in']);
      }

      return this.router.navigate(['']);
    }, (error) => {
      this.user = null;
      return this.router.navigate(['sign-in']);
    });
  }

}
