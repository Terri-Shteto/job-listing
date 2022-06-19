import { Component, OnInit } from '@angular/core';
import { query, onSnapshot, Firestore, where } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AppService } from 'src/app/app.service';
import {
  JobOfferFormDialogConfig,
  JobOfferFormDialogComponent,
} from 'src/app/components/job-offer-form-dialog/job-offer-form-dialog.component';

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.scss']
})
export class JobOffersComponent implements OnInit {
  public jobOffers: any[] = [];
  public dialogRef: MatDialogRef<JobOfferFormDialogComponent>|null = null;

  constructor(
    protected dialog: MatDialog,
    protected firestore: Firestore,
    protected appService: AppService,
  ) { }

  async ngOnInit(): Promise<void> {
    const jobOfferQuery = query(this.appService.jobOfferCollection(), ...[
      where('recruiterId', '==', this.appService.user?.uid),
    ]);

    onSnapshot(jobOfferQuery, (querySnapshot) => {
      this.jobOffers = querySnapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));
    });
  }

  public showJobOfferForm(jobOfferId?: string) {
    this.dialogRef = this.dialog.open(JobOfferFormDialogComponent, {
      width: '768px',
      data: {
        jobOffer: jobOfferId ? this.getJobOffer(jobOfferId) : null,
        onClick: this.handleModalClick.bind(this),
      } as JobOfferFormDialogConfig,
    });
  }

  public getJobOffer(jobOfferId: string) {
    return this.jobOffers.find((jobOffer) => jobOffer.id === jobOfferId);
  }

  public handleModalClick(jobOfferId: string, action: string, data: any) {
    console.log({
      jobOfferId,
      action,
      data,
    });

    switch (action) {
      case 'update':
        this.updateJobOffer(jobOfferId, data);
        break;
      case 'create':
        this.createJobOffer(data);
        break;
      case 'delete':
        this.deleteJobOffer(jobOfferId);
        break;
      default:
        this.dialogRef?.close();
    }
  }

  public async updateJobOffer(jobOfferId: string, data: any) {
    await this.appService.updateJobOffer(jobOfferId, {
      ...data,
    });

    this.dialogRef?.close();
  }

  public async createJobOffer(data: any) {
    await this.appService.addJobOffer({
      recruiterId: this.appService.user?.uid,
      ...data,
    });

    this.dialogRef?.close();
  }

  public async deleteJobOffer(jobOfferId: string) {
    await this.appService.deleteJobOffer(jobOfferId);

    this.dialogRef?.close();
  }
}
