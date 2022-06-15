import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, query, collection, addDoc, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public jobOffers: any[] = [];
  public jobApplications: any[] = [];
  public columns: { [key: string]: string } = {
    companyName: 'Company Name',
    role: 'Job Role',
    skills: 'Skills',
    type: 'Job Type',
    experience: 'Experience',
    actions: 'Actions',
  };
  public columnKeys = Object.keys(this.columns);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) { }

  async ngOnInit(): Promise<void> {
    const jobOfferCollection = collection(this.firestore, 'jobOffers');
    const jobOfferQuery = query(jobOfferCollection);

    onSnapshot(jobOfferQuery, (querySnapshot) => {
      this.jobOffers = querySnapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));
    });

    const jobApplicationCollection = collection(this.firestore, 'jobApplications');
    const jobApplicationQuery = query(jobApplicationCollection);

    onSnapshot(jobApplicationQuery, (querySnapshot) => {
      this.jobApplications = querySnapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));
    });
  }

  public async applyForJob(event: MouseEvent, jobOfferId: string) {
    console.log(jobOfferId, event);

    const userId = this.auth.currentUser?.uid;
    const jobApplicationsRef = collection(this.firestore, 'jobApplications');

    await addDoc(jobApplicationsRef, {
      userId,
      jobOfferId,
    });
  }

  public hasAppliedForJob(jobOfferId: string) {
    return this.jobApplications.find((jobApplication) => {
      const matchUser = jobApplication.userId === this.auth.currentUser?.uid;
      const matchJobOffer = jobApplication.jobOfferId === jobOfferId;

      return matchUser && matchJobOffer;
    }) !== undefined;
  }

}
