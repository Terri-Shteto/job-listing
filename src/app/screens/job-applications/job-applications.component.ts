import { Component, OnInit, Inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Firestore, query, collection, addDoc, onSnapshot, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-job-applications',
  templateUrl: './job-applications.component.html',
  styleUrls: ['./job-applications.component.scss']
})
export class JobApplicationsComponent implements OnInit {
  public jobOffers: any[] = [];
  public jobApplications: string[] = [];
  public dialogRef: MatDialogRef<JobApplicationDetailsDialog>|null = null;

  constructor(
    private auth: Auth,
    private dialog: MatDialog,
    private firestore: Firestore,
  ) { }

  public ngOnInit(): void {
    this.getJobApplications();
  }

  public getJobApplications() {
    const jobApplicationCollection = collection(this.firestore, 'jobApplications');
    const jobApplicationQuery = query(jobApplicationCollection, ...[
      where('userId', '==', this.auth.currentUser?.uid),
    ]);

    onSnapshot(jobApplicationQuery, (querySnapshot) => {
      this.jobApplications = querySnapshot.docs.map((docSnapshot) => {
        return docSnapshot.get('jobOfferId');
      });

      this.getJobOffers();
    });
  }

  public getJobOffers() {
    const jobOfferCollection = collection(this.firestore, 'jobOffers');
    const jobOfferQuery = query(jobOfferCollection, ...[
      where('__name__', 'in', this.jobApplications),
    ]);

    onSnapshot(jobOfferQuery, (querySnapshot) => {
      this.jobOffers = querySnapshot.docs.map((docSnapshot) => {
        return {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        };
      });

      console.log(this.jobOffers);
    });
  }

  public showJobOfferDetails(jobOfferId: string) {
    this.dialogRef = this.dialog.open(JobApplicationDetailsDialog, {
      width: '768px',
      data: {
        jobOffer: this.getJobOffer(jobOfferId),
        onClick: this.handleModalClick.bind(this),
      } as JobApplicationDetailsDialogConfig,
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

}

interface JobApplicationDetailsDialogConfig {
  jobOffer: any,
  onClick: (jobOfferId: string, action: string) => void,
}

@Component({
  selector: 'job-application-details-dialog',
  templateUrl: '../../components/dialogs/job-application-details-dialog.html',
})
export class JobApplicationDetailsDialog {
  constructor(
    public dialogRef: MatDialogRef<JobApplicationDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: JobApplicationDetailsDialogConfig,
  ) {}
}
