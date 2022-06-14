import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, query, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public jobOffers: any[] = [];
  public columns: { [key: string]: string } = {
    companyName: 'Company Name',
    role: 'Job Role',
    skills: 'Skills',
    type: 'Job Type',
    experience: 'Experience',
  };
  public columnKeys = Object.keys(this.columns);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) { }

  async ngOnInit(): Promise<void> {
    const jobOfferCollection = collection(this.firestore, 'jobOffers');
    const jobOfferQuery = query(jobOfferCollection);
    const jobOfferSnapshot = await getDocs(jobOfferQuery);

    this.jobOffers = jobOfferSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    // console.log(this.jobOffers);
  }

}
