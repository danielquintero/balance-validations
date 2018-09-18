import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Store, select} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import {CustomerStatement} from '@rabo/file/statement.model';
import {Observable} from 'rxjs';

@Component({
	selector: 'app-data-table',
	templateUrl: './data-table.component.html',
	styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
	public records$: Observable<CustomerStatement[]>;
	public displayedColumns: string[];
	public dataSource: MatTableDataSource<any>;

	@ViewChild(MatSort)
	sort: MatSort;

	constructor(private store: Store<fromRoot.State>) {}

	ngOnInit() {
		this.displayedColumns = [
			'reference',
			'accountNumber',
			'startBalance',
			'mutation',
			'description',
			'endBalance',
			'validation'
		];
		this.init();
	}

	private init() {
		this.records$ = this.store.pipe(select(fromRoot.getRecords));
		this.records$.subscribe((records: CustomerStatement[]) => {
			if (records) {
				this.dataSource = new MatTableDataSource(records);
				this.dataSource.sort = this.sort;
			}
		});
	}
}
