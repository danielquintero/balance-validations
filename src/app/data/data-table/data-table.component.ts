import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Store, select} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import {CustomerStatement} from '@rabo/file/statement.model';
import {Observable, Subscription} from 'rxjs';

@Component({
	selector: 'app-data-table',
	templateUrl: './data-table.component.html',
	styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnDestroy {
	public records$: Observable<CustomerStatement[]>;
	public displayedColumns: string[];
	public dataSource: MatTableDataSource<any>;

	@ViewChild(MatSort, {static: true})
	sort: MatSort;

	private subscriptions: Subscription;

	constructor(private store: Store<fromRoot.State>) {}

	ngOnInit() {
		this.init();
	}

	public ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	private init() {
		this.displayedColumns = [
			'reference',
			'accountNumber',
			'startBalance',
			'mutation',
			'description',
			'endBalance',
			'validation'
		];
		this.subscriptions = new Subscription();
		this.records$ = this.store.pipe(select(fromRoot.getRecords));
		this.subscriptions.add(
			this.records$.subscribe((records: CustomerStatement[]) => {
				if (records) {
					this.dataSource = new MatTableDataSource(records);
					this.dataSource.sort = this.sort;
				}
			})
		);
	}
}
