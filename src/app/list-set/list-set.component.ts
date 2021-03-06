import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FetchDataService } from '../fetch-data.service';
import { AgGridModule } from 'ag-grid-angular';
import { ButtonRendererComponent } from './button-render.component';

@Component({
  selector: 'app-list-set',
  templateUrl: './list-set.component.html',
  styleUrls: ['./list-set.component.css']
})
export class ListSetComponent implements OnInit {


  public items = [];
  public overlayFlag: boolean = false;
  public formControls: any;
  public listform: FormGroup;
  public columnDefs: any;
  public rowData: any = [];
  public formData: any;
  public gridApi;
  public gridColumnApi;
  public frameworkComponents: any;
  constructor(private route: ActivatedRoute,
    private fetch: FetchDataService,
    private fb: FormBuilder,
    private router: Router, ) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    }
  }

  ngOnInit(): void {
    this.formData = localStorage.getItem('formData') ? localStorage.getItem('formData') : [];
    this.initializeForm();
    this.columnDefs = [{ headerName: "Title", field: "title", editable: true, rowDrag: true },
    { headerName: "Description", field: "description", editable: true, rowDrag: true },
    {
      headerName: "Priority", field: "priority", editable: true, rowDrag: true,
      sortable: true, filter: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        cellRenderer: (params) => params.value.Name,
        values: ['High', 'Medium', 'Low']
      },
    },
    { headerName: "CompletionTime", field: "completionTime", editable: true, rowDrag: true },
    {
      headerName: "Status", field: "status", editable: true, rowDrag: true,
      sortable: true, filter: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        cellRenderer: (params) => params.value.Name,
        values: ['In Process', 'Completed', 'Pending']
      },
    },
    {
      headerName: 'Save',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onSaveButtonClick.bind(this),
        label: 'Save'
      },
    },
    {
      headerName: 'Delete',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onDeleteButtonClick.bind(this),
        label: 'Delete'
      },
    },
    ];
  }

  /**
   * Method to define personal info form group
   * @method initializeForm
   */
  private initializeForm() {
    this.listform = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: ['Medium'],
      completionTime: ['', [Validators.required]],
      status: ['Pending']
    });
    this.formControls = this.listform.controls;
  }
  public addToList() {
    this.overlayFlag = true;
    Object.keys(this.formControls).forEach(item => {
      this.formControls[item].clearValidators();
      this.formControls[item].updateValueAndValidity();
    });
    this.initializeForm();
  }
  public disablePopUp() {
    this.overlayFlag = false;
    Object.keys(this.formControls).forEach(item => {
      this.formControls[item].clearValidators();
      this.formControls[item].updateValueAndValidity();
    });
  }
  public saveTasks() {
    if (this.listform.valid) {
      this.overlayFlag = false;
      let data = {
        title: this.formControls.title.value,
        description: this.formControls.description.value,
        priority: this.formControls.priority.value,
        completionTime: this.formControls.completionTime.value,
        status: this.formControls.status.value
      }
      this.rowData.push(data);
      this.gridApi.setRowData(this.rowData);
      localStorage.setItem('formData', JSON.stringify(this.rowData));
    }

  }
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.localStorageData();
  }

  public onSaveButtonClick(params) {
    this.gridApi.stopEditing();
    localStorage.setItem('formData', JSON.stringify(this.rowData));
  }
  public onDeleteButtonClick(params) {
    var selected = this.gridApi.getFocusedCell();
    this.rowData.splice(selected.rowIndex, 1);
    this.gridApi.setRowData(this.rowData);
    localStorage.setItem('formData', JSON.stringify(this.rowData));

  }
  public localStorageData() {
    if (this.formData != '[]') {
      this.rowData = JSON.parse(this.formData);
      this.gridApi.setRowData(this.rowData);
    }
  }
}
