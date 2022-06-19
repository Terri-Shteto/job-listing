import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface JobOfferFormDialogConfig {
  jobOffer: any,
  onClick: (jobOfferId: string, action: string, data: any) => void,
}

@Component({
  selector: 'app-job-offer-form-dialog',
  templateUrl: './job-offer-form-dialog.component.html',
  styleUrls: ['./job-offer-form-dialog.component.scss']
})
export class JobOfferFormDialogComponent {
  public jobForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<JobOfferFormDialogComponent>,
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
