import { Component, OnInit, Inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Firestore, query, collection, addDoc, onSnapshot, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-job-favorites',
  templateUrl: './job-favorites.component.html',
  styleUrls: ['./job-favorites.component.scss']
})
export class JobFavoritesComponent implements OnInit {
  public jobOffers: any[] = [];
  public jobFavorites: string[] = [];
  public dialogRef: MatDialogRef<JobFavoriteDetailsDialog>|null = null;

  constructor(
    private auth: Auth,
    private dialog: MatDialog,
    private firestore: Firestore,
  ) { }

  public ngOnInit(): void {
    this.getJobFavorites();
  }

  public getJobFavorites() {
    const jobFavoriteCollection = collection(this.firestore, 'jobFavorites');
    const jobFavoriteQuery = query(jobFavoriteCollection, ...[
      where('userId', '==', this.auth.currentUser?.uid),
    ]);

    onSnapshot(jobFavoriteQuery, (querySnapshot) => {
      this.jobFavorites = querySnapshot.docs.map((docSnapshot) => {
        return docSnapshot.get('jobOfferId');
      });

      this.getJobOffers();
    });
  }

  public getJobOffers() {
    if (!this.jobFavorites.length) {
      return;
    }

    const jobOfferCollection = collection(this.firestore, 'jobOffers');
    const jobOfferQuery = query(jobOfferCollection, ...[
      where('__name__', 'in', this.jobFavorites),
    ]);

    onSnapshot(jobOfferQuery, (querySnapshot) => {
      this.jobOffers = querySnapshot.docs.map((docSnapshot) => {
        return {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        };
      });
    });
  }

  public showJobOfferDetails(jobOfferId: string) {
    this.dialogRef = this.dialog.open(JobFavoriteDetailsDialog, {
      width: '768px',
      data: {
        jobOffer: this.getJobOffer(jobOfferId),
        onClick: this.handleModalClick.bind(this),
      } as JobFavoriteDetailsDialogConfig,
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

interface JobFavoriteDetailsDialogConfig {
  jobOffer: any,
  onClick: (jobOfferId: string, action: string) => void,
}

@Component({
  selector: 'job-application-details-dialog',
  templateUrl: '../../components/dialogs/job-application-details-dialog.html',
})
export class JobFavoriteDetailsDialog {
  constructor(
    public dialogRef: MatDialogRef<JobFavoriteDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: JobFavoriteDetailsDialogConfig,
  ) {}
}
