import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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
export class JobListTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input()  public jobOffers: any[] = [];
  @Output() public onJobOfferClick = new EventEmitter<string>();

  public dataSource = new MatTableDataSource(this.jobOffers);
  public columns = COLUMNS;
  public columnKeys = Object.keys(this.columns);
  public data: any[] = [];

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  public constructor() { }

  public ngOnInit() { }

  public ngOnChanges(changes: SimpleChanges) {
    this.jobOffers = changes['jobOffers'].currentValue;
    this.dataSource.data = this.jobOffers;
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  public jobOfferClicked(jobOfferId: string) {
    this.onJobOfferClick.emit(jobOfferId);
  }
}
