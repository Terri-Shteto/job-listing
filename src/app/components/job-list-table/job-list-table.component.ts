import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

const COLUMNS = {
  companyName: 'Company Name',
  role: 'Job Role',
  type: 'Job Type',
  skills: 'Skills',
  experience: 'Experience',
} as { [key: string]: string };

@Component({
  selector: 'app-job-list-table',
  templateUrl: './job-list-table.component.html',
  styleUrls: ['./job-list-table.component.scss'],
})
export class JobListTableComponent implements OnInit {
  @Input()  public jobOffers: any[] = [];
  @Output() public onJobOfferClick = new EventEmitter<string>();

  public columns = COLUMNS;
  public columnKeys = Object.keys(this.columns);

  constructor() { }

  public ngOnInit(): void { }

  public jobOfferClicked(jobOfferId: string) {
    this.onJobOfferClick.emit(jobOfferId);
  }
}
