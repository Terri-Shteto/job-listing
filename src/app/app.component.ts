import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, DocumentData } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'job-listing';
  public user: User|null = null;
  public userData: DocumentData = {};

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore,
    ) {
  }

  protected ngOnInit() {
    this.auth.onAuthStateChanged(async (user) => {
      this.user = user;
      this.userData = await this.getUserData(this.user?.uid);

      if (!user) {
        return this.router.navigate(['sign-in']);
      }

      return this.router.navigate(['']);
    }, (error) => {
      this.user = null;
      this.userData = {};

      return this.router.navigate(['sign-in']);
    });
  }

  public async getUserData(userId: string|undefined) {
    if (!userId) {
      return {};
    }

    const userRef = doc(this.firestore, `users/${userId}`);
    const userSnapshot = await getDoc(userRef);

    return userSnapshot.data() || {};
  }
}
