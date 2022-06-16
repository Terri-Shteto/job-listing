import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, query, onSnapshot, Firestore, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.scss']
})
export class JobOffersComponent implements OnInit {
  public jobOffers: any[] = [];

  constructor(
    protected auth: Auth,
    protected firestore: Firestore,
  ) { }

  async ngOnInit(): Promise<void> {
    const jobOfferCollection = collection(this.firestore, 'jobOffers');
    const jobOfferConstraints = [
      where('recruiterId', '==', this.auth.currentUser?.uid),
    ];

    const jobOfferQuery = query(jobOfferCollection, ...jobOfferConstraints);

    onSnapshot(jobOfferQuery, (querySnapshot) => {
      this.jobOffers = querySnapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));
    });
  }
}
