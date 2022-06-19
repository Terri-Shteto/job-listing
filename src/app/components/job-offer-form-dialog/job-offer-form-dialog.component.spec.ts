import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOfferFormDialogComponent } from './job-offer-form-dialog.component';

describe('JobOfferFormDialogComponent', () => {
  let component: JobOfferFormDialogComponent;
  let fixture: ComponentFixture<JobOfferFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobOfferFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobOfferFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
