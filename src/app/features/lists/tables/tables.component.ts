import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PopupService } from '@app/features/popup';
import { AppState } from '@app/store';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Table, TableEvents } from './models/tables.model';
import { GetTables } from './tables-store/tables.action';
import { selectAllTables } from './tables-store/tables.selector';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  @Output() tableEvent = new EventEmitter<{ action: string, table: Table }>();
  tables!: Table[];
  subscriptions = new Subscription();
  selectedTable!: Table;

  public tableEvents = TableEvents;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    public popupService: PopupService
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetTables());

    this.subscriptions.add(
      this.store.select(selectAllTables).subscribe(
        tables => {
          this.tables = tables
        }
      )
    );
  }

  emitTableEvent(event: TableEvents) {
    if (event == TableEvents.VIEW) {
      this.router.navigate(['lists/tables/', (this.selectedTable as Table)._id]);
    }
  }

  showOption(table: Table) {
    return this.selectedTable
      ? table._id == this.selectedTable._id
      : false;
  }
}
