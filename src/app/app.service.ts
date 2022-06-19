import { Injectable } from '@angular/core';
import { Auth, Unsubscribe, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { updateDoc } from 'firebase/firestore';

import {
  Firestore,
  DocumentData,
  QueryConstraint,
  DocumentSnapshot,
  collection,
  query,
  where,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  collectionSnapshots,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public user: User|null = null;
  public userData: DocumentSnapshot<DocumentData>|null = null;

  protected userDataSnapshotUnsubscribe: Unsubscribe|null = null;

  constructor(
    public auth: Auth,
    public router: Router,
    public firestore: Firestore,
  ) {
    this.auth.onAuthStateChanged(async (user) => {
      this.user = user;
      this.getUserData(this.user?.uid);

      if (!user) {
        return this.router.navigate(['sign-in']);
      }

      return this.router.navigate(['']);
    }, (error) => {
      this.user = null;
      this.getUserData(undefined); // Remove user data.

      return this.router.navigate(['sign-in']);
    });
  }

  protected async getUserData(userId: string|undefined) {
    if (!userId) {
      this.userData = null;
      this.userDataSnapshotUnsubscribe?.();
    }

    const userRef = doc(this.firestore, `users/${userId}`);

    this.userDataSnapshotUnsubscribe = onSnapshot(userRef, (snapshot) => {
      this.userData = snapshot;
    });
  }

  // Job Offers
  public jobOfferCollection() {
    return collection(this.firestore, 'jobOffers');
  }

  public jobOfferQuery(queryConstraints: QueryConstraint[] = []) {
    return query(this.jobOfferCollection(), ...queryConstraints)
  }

  public addJobOffer(data: any) {
    return addDoc(this.jobOfferCollection(), data);
  }

  public jobOfferDoc(id: string) {
    const jobOfferCollectionPath = this.jobOfferCollection().path;
    return doc(this.firestore, `${jobOfferCollectionPath}/${id}`);
  }

  public updateJobOffer(id: string, data: any) {
    return updateDoc(this.jobOfferDoc(id), data);
  }

  public deleteJobOffer(id: string) {
    return deleteDoc(this.jobOfferDoc(id));
  }

  // Job Favorites
  public jobFavoriteCollection() {
    return collection(this.firestore, 'jobFavorites');
  }

  public jobFavoriteQuery(queryConstraints: QueryConstraint[] = []) {
    return query(this.jobFavoriteCollection(), ...queryConstraints)
  }

  public addJobFavorite(data: any) {
    return addDoc(this.jobFavoriteCollection(), data);
  }

  public jobFavoriteDoc(id: string) {
    const jobFavoriteCollectionPath = this.jobFavoriteCollection().path;
    return doc(this.firestore, `${jobFavoriteCollectionPath}/${id}`);
  }

  public updateJobFavorite(id: string, data: any) {
    return updateDoc(this.jobFavoriteDoc(id), data);
  }

  public deleteJobFavorite(id: string) {
    return deleteDoc(this.jobFavoriteDoc(id));
  }

  // Job Applications
  public jobApplicationCollection() {
    return collection(this.firestore, 'jobApplications');
  }

  public jobApplicationQuery(queryConstraints: QueryConstraint[] = []) {
    return query(this.jobApplicationCollection(), ...queryConstraints)
  }

  public addJobApplication(data: any) {
    return addDoc(this.jobApplicationCollection(), data);
  }

  public jobApplicationDoc(id: string) {
    const jobApplicationCollectionPath = this.jobApplicationCollection().path;
    return doc(this.firestore, `${jobApplicationCollectionPath}/${id}`);
  }

  public updateJobApplication(id: string, data: any) {
    return updateDoc(this.jobApplicationDoc(id), data);
  }

  public deleteJobApplication(id: string) {
    return deleteDoc(this.jobApplicationDoc(id));
  }

  // User-related helpers.
  public getUserFavoriteForJob(jobOfferId: string, userId?: string) {
    return collectionSnapshots(this.jobFavoriteQuery([
      where('jobOfferId', '==', jobOfferId),
      where('userId', '==', userId || this.user?.uid),
    ]));
  }

  public getUserApplicationForJob(jobOfferId: string, userId?: string) {
    return collectionSnapshots(this.jobApplicationQuery([
      where('jobOfferId', '==', jobOfferId),
      where('userId', '==', userId || this.user?.uid),
    ]));
  }
}
