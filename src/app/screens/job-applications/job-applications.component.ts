import { Component, OnInit } from '@angular/core';
import { onSnapshot, QueryConstraint, where } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AppService } from 'src/app/app.service';
import {
  JobOfferDetailsDialogConfig,
  JobOfferDetailsDialogComponent,
} from 'src/app/components/job-offer-details-dialog/job-offer-details-dialog.component';

@Component({
  selector: 'app-job-applications',
  templateUrl: './job-applications.component.html',
  styleUrls: ['./job-applications.component.scss'],
})
export class JobApplicationsComponent implements OnInit {
  public jobOffers: any[] = [];
  public jobApplications: string[] = [];
  public dialogRef: MatDialogRef<JobOfferDetailsDialogComponent>|null = null;

  constructor(
    protected dialog: MatDialog,
    protected appService: AppService,
  ) { }

  public ngOnInit(): void {
    const role = this.appService.userData.role;

    switch (role) {
      case 'seeker':
        this.getJobApplicationsForUser();
        break;
      case 'recruiter':
        this.getJobApplicationsForRecruiter();
        break;
    }
  }

  public getJobApplicationsForUser() {
    this.getJobApplications([
      where('userId', '==', this.appService.user?.uid),
    ]);
  }

  public getJobApplicationsForRecruiter() {
    const jobOfferQuery = this.appService.jobOfferQuery([
      where('recruiterId', '==', this.appService.user?.uid),
    ]);

    onSnapshot(jobOfferQuery, (querySnapshot) => {
      const jobOfferIds = querySnapshot.docs.map((docSnapshot) => docSnapshot.id);

      this.getJobApplications([
        where('jobOfferId', 'in', jobOfferIds),
      ]);
    });
  }

  public getJobApplications(filters: QueryConstraint[] = []) {
    const jobApplicationQuery = this.appService.jobApplicationQuery(filters);

    onSnapshot(jobApplicationQuery, (querySnapshot) => {
      this.jobApplications = querySnapshot.docs.map((docSnapshot) => {
        return docSnapshot.get('jobOfferId');
      });

      this.getJobOffers();
    });
  }

  public getJobOffers() {
    if (!this.jobApplications.length) {
      return;
    }

    const jobOfferQuery = this.appService.jobOfferQuery([
      where('__name__', 'in', this.jobApplications),
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
    this.dialogRef = this.dialog.open(JobOfferDetailsDialogComponent, {
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

  public handleModalClick(id: string, action: string) {
    switch (action) {
      case 'apply':
        this.applyForJob(id);
        break;
      case 'cancel':
        this.cancelJobApplication(id);
        break;
      case 'favorite':
        this.markAsFavorite(id);
        break;
      case 'unfavorite':
        this.removeFromFavorites(id);
        break;
      default:
        this.dialogRef?.close();
    }
  }

  public async applyForJob(jobOfferId: string) {
    await this.appService.addJobApplication({
      userId: this.appService.user?.uid,
      jobOfferId: jobOfferId,
    });

    this.dialogRef?.close();
  }

  public async cancelJobApplication(jobApplicationId: string) {
    await this.appService.deleteJobApplication(jobApplicationId);

    this.dialogRef?.close();
  }

  public async markAsFavorite(jobOfferId: string) {
    await this.appService.addJobFavorite({
      userId: this.appService.user?.uid,
      jobOfferId: jobOfferId,
    });
  }

  public async removeFromFavorites(jobFavoriteId: string) {
    await this.appService.deleteJobFavorite(jobFavoriteId);
  }
}
