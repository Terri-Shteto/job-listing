import { Component, OnInit } from '@angular/core';
import { onSnapshot, where } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AppService } from 'src/app/app.service';
import {
  JobOfferDetailsDialogConfig,
  JobOfferDetailsDialogComponent,
} from 'src/app/components/job-offer-details-dialog/job-offer-details-dialog.component';

@Component({
  selector: 'app-job-favorites',
  templateUrl: './job-favorites.component.html',
  styleUrls: ['./job-favorites.component.scss'],
})
export class JobFavoritesComponent implements OnInit {
  public jobOffers: any[] = [];
  public jobFavorites: string[] = [];
  public dialogRef: MatDialogRef<JobOfferDetailsDialogComponent>|null = null;

  constructor(
    private dialog: MatDialog,
    private appService: AppService,
  ) { }

  public ngOnInit(): void {
    this.getJobFavorites();
  }

  public getJobFavorites() {
    const jobFavoriteQuery = this.appService.jobFavoriteQuery([
      where('userId', '==', this.appService.user?.uid),
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

    const jobOfferQuery = this.appService.jobOfferQuery([
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
