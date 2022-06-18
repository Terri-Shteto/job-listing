import { Component, Inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, query, onSnapshot, Firestore, where, doc, updateDoc, addDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.scss']
})
export class JobOffersComponent implements OnInit {
  public jobOffers: any[] = [];
  public loading: boolean = false;
  public dialogRef: MatDialogRef<JobOfferFormDialog>|null = null;

  constructor(
    protected auth: Auth,
    protected dialog: MatDialog,
    protected firestore: Firestore,
  ) { }

  async ngOnInit(): Promise<void> {
    const jobOfferCollection = collection(this.firestore, 'jobOffers');
    const jobOfferConstraints = [
      where('recruiterId', '==', this.auth.currentUser?.uid),
    ];

    const jobOfferQuery = query(jobOfferCollection, ...jobOfferConstraints);

    onSnapshot(jobOfferQuery, (querySnapshot) => {
      this.jobOffers = querySnapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));
    });
  }

  public showJobOfferForm(jobOfferId?: string) {
    this.dialogRef = this.dialog.open(JobOfferFormDialog, {
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
      default:
        this.dialogRef?.close();
    }
  }

  public async updateJobOffer(jobOfferId: string, data: any) {
    const jobOfferDoc = doc(this.firestore, `jobOffers/${jobOfferId}`);

    this.toggleLoading(true);
    await updateDoc(jobOfferDoc, data);
    this.toggleLoading(false);

    this.dialogRef?.close();
  }

  public async createJobOffer(data: any) {
    const userId = this.auth.currentUser?.uid;
    const jobOffersRef = collection(this.firestore, 'jobOffers');

    this.toggleLoading(true);
    await addDoc(jobOffersRef, { recruiterId: userId, ...data });
    this.toggleLoading(false);

    this.dialogRef?.close();
  }

  public toggleLoading(toggle?: boolean) {
    this.loading = toggle === undefined ? !this.loading : toggle;
  }
}

interface JobOfferFormDialogConfig {
  jobOffer: any,
  onClick: (jobOfferId: string, action: string, data: any) => void,
}

@Component({
  selector: 'job-offer-form-dialog',
  templateUrl: '../../components/dialogs/job-offer-form-dialog.html',
})
export class JobOfferFormDialog {
  public jobForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<JobOfferFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: JobOfferFormDialogConfig,
  ) {
    const jobOffer = this.data.jobOffer;

    this.jobForm = this.formBuilder.group({
      companyName: [jobOffer?.companyName || '', Validators.compose([
        Validators.required,
      ])],
      experience: [jobOffer?.experience || '', Validators.compose([
        Validators.required,
      ])],
      role: [jobOffer?.role || '', Validators.compose([
        Validators.required,
      ])],
      skills: [jobOffer?.skills || '', Validators.compose([
        Validators.required,
      ])],
      type: [jobOffer?.type || '', Validators.compose([
        Validators.required,
      ])],
    });
  }

  public submitForm() {
    const data = this.jobForm.value;
    const jobOfferId = this.data.jobOffer?.id || '';
    const action = jobOfferId ? 'update' : 'create';

    this.data.onClick(jobOfferId, action, data);
  }

  public hasError(controlName: string) {
    const control = this.jobForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  public getError(controlName: string) {
    if (!this.hasError(controlName)) {
      return '';
    }

    return Object.keys(this.jobForm.controls[controlName].errors || {})[0];
  }

  public getErrorMessage(controlName: string) {
    const errorName = this.getError(controlName);

    return ({
      companyName: {
        required: 'Company name is required!',
      },
      experience: {
        required: 'Experience is required!',
      },
      role: {
        required: 'Role is required!',
      },
      skills: {
        required: 'Skills is required!',
      },
      type: {
        required: 'Type is required!',
      },
    }[controlName] as any)[errorName] || 'Invalid field!';
  }
}
