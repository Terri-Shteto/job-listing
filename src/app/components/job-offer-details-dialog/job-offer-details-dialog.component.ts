import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentData, Firestore, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { AppService } from 'src/app/app.service';

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
  public favorite: QueryDocumentSnapshot<DocumentData> | undefined | null = null;
  public application: QueryDocumentSnapshot<DocumentData> | undefined | null = null;

  constructor(
    public firestore: Firestore,
    public appService: AppService,
    public dialogRef: MatDialogRef<JobOfferDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JobOfferDetailsDialogConfig,
  ) { }

  public ngOnInit(): void {
    this.role = this.appService.userData.role;

    this.appService.getUserFavoriteForJob(this.data.jobOffer.id).subscribe((querySnapshot) => {
      this.favorite = querySnapshot.shift();
      this.calculateLoadingState();
    });

    this.appService.getUserApplicationForJob(this.data.jobOffer.id).subscribe((querySnapshot) => {
      this.application = querySnapshot.shift();
      this.calculateLoadingState();
    });
  }

  protected calculateLoadingState(): void {
    this.loading = this.favorite === null || this.application === null;
  }
}
