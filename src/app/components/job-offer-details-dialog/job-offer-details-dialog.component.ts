import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Firestore, DocumentData, DocumentSnapshot, doc, getDoc, QueryDocumentSnapshot, onSnapshot } from '@angular/fire/firestore';

import { AppService } from '../../app.service';

export interface JobOfferDetailsDialogConfig {
  jobOffer: any,
  onClick: (id: string, action: string) => void,
}

@Component({
  selector: 'app-job-offer-details-dialog',
  templateUrl: './job-offer-details-dialog.component.html',
  styleUrls: ['./job-offer-details-dialog.component.scss'],
})
export class JobOfferDetailsDialogComponent implements OnInit {
  public role: 'recruiter' | 'seeker' | null = null;
  public loading: boolean = true;
  public seeker: DocumentSnapshot<DocumentData> | undefined | null = null;
  public favorite: QueryDocumentSnapshot<DocumentData> | undefined | null = null;
  public application: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData> | undefined | null = null;

  constructor(
    public router: Router,
    public firestore: Firestore,
    public appService: AppService,
    public dialogRef: MatDialogRef<JobOfferDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JobOfferDetailsDialogConfig,
  ) { }

  public ngOnInit(): void {
    this.role = this.appService.userData?.get('role');

    this.appService.getUserFavoriteForJob(this.data.jobOffer.id).subscribe((querySnapshot) => {
      this.favorite = querySnapshot.shift();
      this.calculateLoadingState();
    });

    if (this.data.jobOffer.jobApplicationId) {
      const jobApplicationRef = this.appService.jobApplicationDoc(this.data.jobOffer.jobApplicationId);

      onSnapshot(jobApplicationRef, async (snapshot) => {
        this.application = snapshot;
        await this.getSeekerData();
        this.calculateLoadingState();
      });
    } else {
      this.appService.getUserApplicationForJob(this.data.jobOffer.id).subscribe(async (querySnapshot) => {
        this.application = querySnapshot.shift();
        await this.getSeekerData();
        this.calculateLoadingState();
      });
    }
  }

  protected async getSeekerData(): Promise<void> {
    if (!this.application || !this.application.exists()) {
      return;
    }

    const seekerId = this.application.get('userId');
    const seekerRef = doc(this.firestore, `users/${seekerId}`);

    this.seeker = await getDoc(seekerRef);
  }

  protected calculateLoadingState(): void {
    this.loading = this.favorite === null || this.application === null;
  }

  protected showApplicantData() {
    return (
      this.router.url === '/job-applications'
      && this.role === 'recruiter'
      && this.seeker?.exists()
    );
  }

  protected getGenderLabel(gender?: string) {
    switch (gender) {
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
      default:
        return 'Not specified';
    };
  }
}
