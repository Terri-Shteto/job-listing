import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOfferDetailsDialogComponent } from './job-offer-details-dialog.component';

describe('JobOfferDetailsDialogComponent', () => {
  let component: JobOfferDetailsDialogComponent;
  let fixture: ComponentFixture<JobOfferDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobOfferDetailsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobOfferDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
