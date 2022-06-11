import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'job-listing';

  constructor(private router: Router, private auth: Auth) {}

  protected ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      if (!user) {
        return this.router.navigate(['sign-in']);
      }

      return this.router.navigate(['']);
    }, (error) => {
      return this.router.navigate(['sign-in']);
    });
  }

}
