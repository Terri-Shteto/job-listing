import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobListTableComponent } from './job-list-table.component';

describe('JobListTableComponent', () => {
  let component: JobListTableComponent;
  let fixture: ComponentFixture<JobListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobListTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
