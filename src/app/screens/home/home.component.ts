import { Component, OnInit, Inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Firestore, query, collection, addDoc, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public jobOffers: any[] = [];
  public jobApplications: any[] = [];
  public dialogRef: MatDialogRef<JobOfferDetailsDialog>|null = null;

  constructor(
    private auth: Auth,
    private dialog: MatDialog,
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

  public showJobOfferDetails(jobOfferId: string) {
    this.dialogRef = this.dialog.open(JobOfferDetailsDialog, {
      width: '768px',
      data: {
        jobOffer: this.getJobOffer(jobOfferId),
        onClick: this.handleModalClick.bind(this),
      } as JobOfferDetailsDialogConfig,
    });
  }

  public getJobOffer(jobOfferId: string) {
    return this.jobOffers.find((jobOffer) => jobOffer.id === jobOfferId);
  }

  public handleModalClick(jobOfferId: string, action: string) {
    switch (action) {
      case 'apply':
        this.applyForJob(jobOfferId);
        break;
      case 'favorite':
        this.markAsFavorite(jobOfferId);
        break;
      default:
        this.dialogRef?.close();
    }
  }

  public async applyForJob(jobOfferId: string) {
    const userId = this.auth.currentUser?.uid;
    const jobApplicationsRef = collection(this.firestore, 'jobApplications');

    await addDoc(jobApplicationsRef, {
      userId,
      jobOfferId,
    });

    console.log('applying for job', jobOfferId);

    this.dialogRef?.close();
  }

  public async markAsFavorite(jobOfferId: string) {
    console.log('marking job as favorite', jobOfferId);

    this.dialogRef?.close();
  }

  public hasAppliedForJob(jobOfferId: string) {
    return this.jobApplications.find((jobApplication) => {
      const matchUser = jobApplication.userId === this.auth.currentUser?.uid;
      const matchJobOffer = jobApplication.jobOfferId === jobOfferId;

      return matchUser && matchJobOffer;
    }) !== undefined;
  }

}

interface JobOfferDetailsDialogConfig {
  jobOffer: any,
  onClick: (jobOfferId: string, action: string) => void,
}

@Component({
  selector: 'job-offer-details-dialog',
  templateUrl: '../../components/dialogs/job-offer-details-dialog.html',
})
export class JobOfferDetailsDialog {
  constructor(
    public dialogRef: MatDialogRef<JobOfferDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: JobOfferDetailsDialogConfig,
  ) {}
}
