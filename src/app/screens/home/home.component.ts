import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Firestore, query, collection, addDoc, onSnapshot } from '@angular/fire/firestore';

import {
  JobOfferDetailsDialogConfig,
  JobOfferDetailsDialogComponent,
} from '../../components/job-offer-details-dialog/job-offer-details-dialog.component';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public jobOffers: any[] = [];
  public dialogRef: MatDialogRef<JobOfferDetailsDialogComponent>|null = null;

  constructor(
    private dialog: MatDialog,
    private appService: AppService,
  ) { }

  async ngOnInit(): Promise<void> {
    onSnapshot(this.appService.jobOfferQuery(), (querySnapshot) => {
      this.jobOffers = querySnapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));
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
