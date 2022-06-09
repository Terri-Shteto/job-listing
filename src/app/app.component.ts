import { Component, Input } from '@angular/core';
import {
  Auth,
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  user,
} from '@angular/fire/auth';

import {  } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'job-listing';
  public user: User|null = null;

  public email: string = '';
  public pass: string = '';

  constructor(
    private auth: Auth
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    }, (error) => {

    }, () => {

    });
  }

  public handleRegister(event: Event) {
    event.preventDefault();
    console.log(this.email, this.pass);
    createUserWithEmailAndPassword(this.auth, this.email, this.pass)
      .then((response) => {
        console.log({ response });
      }).catch((error) => {
        console.log({ error });  
      });
  }

  public handleLogin(event: Event) {
    event.preventDefault();

    signInWithEmailAndPassword(this.auth, this.email, this.pass)
      .then((response) => {
        console.log({ response });
      }).catch((error) => {
        console.log({ error });
      });
  }

  public handleLogout(event: Event) {
    this.auth.signOut();
  }

  public setEmail(event: Event) {
    const target = event.target as HTMLInputElement;
    this.email = target.value || '';
  }

  public setPass(event: Event) {
    const target = event.target as HTMLInputElement;
    this.pass = target.value || '';

    console.log({ value: target.value, pass: this.pass });
  }
}
