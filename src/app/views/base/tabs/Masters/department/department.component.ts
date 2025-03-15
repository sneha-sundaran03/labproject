import { Component, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  DxDataGridModule,
  DxToolbarModule,
  DxButtonModule,
  DxPopupModule,
  DxCheckBoxModule,
  DxTextBoxModule,
  DxFormModule,
  DxDataGridComponent,
} from "devextreme-angular";
// import {DataserviceService } from 'src/app/services/dataservice.service';
import notify from "devextreme/ui/notify";
import { DataserviceService } from "../../../../../services/dataservice.service";

// import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
@Component({
  selector: "app-department",
  standalone: true,
  imports: [
    DxDataGridModule,
    DxToolbarModule,
    DxButtonModule,
    DxPopupModule,
    ReactiveFormsModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxFormModule,
  ],
  templateUrl: "./department.component.html",
  styleUrl: "./department.component.scss",
})
export class DepartmentComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  
  dataGrid!: DxDataGridComponent; 
  isAddPop: boolean = false;
  isEditPop: boolean = false;
  //store value for edit Department
  editDepartmentData: any;
  //form source for add Department
  formsource: FormGroup;
  dataSource: any;
  popupWidth: number = 500;
  applyFilterTypes = [
    {
      key: "auto",
      name: "Immediately",
    },
    {
      key: "onClick",
      name: "On Button Click",
    },
  ];

  showFilterRow = true;
  currentFilter = this.applyFilterTypes[0].key;
  showHeaderFilter = true;



  constructor(private fb: FormBuilder, private service: DataserviceService) {
    this.formsource = this.fb.group({
      Id: [null],
      Department: ["", [Validators.required]],
      Status: [false, [Validators.required]],
    });
    this.get_departmentData_List();
  }

  ngOnInit() {
    this.setPopupWidth();
    window.addEventListener('resize', this.setPopupWidth.bind(this));
  }
  
  ngOnDestroy() {
    window.removeEventListener('resize', this.setPopupWidth.bind(this));
  }
  
  setPopupWidth() {
    this.popupWidth = window.innerWidth <= 400 ? 320 : 500;
  }

  
  formatStatus(data: any) {
    return data.IS_INACTIVE ? "Inactive" : "Active";
  }
//=============================== Get all department Data ======================================

  get_departmentData_List() {
    this.service.get_DepartmentData_List().subscribe((response: any) => {
      if (response) {
        this.dataSource = response.Data;
        console.log(response.Data);
      }
    });
  }

  //========================add new Department  functionality==========================

  addData() {
    const Department = this.formsource.value.Department;
    const Status = this.formsource.value.Status;

    const isDuplicate = this.dataSource.some((item: any) => {
      return item.DEPARTMENT.toLowerCase() === Department.toLowerCase();
    });
    if (isDuplicate) {
      notify(
        {
          message: "Department already exists!",
          position: { at: "top right", my: "top right" },
          displayTime: 500,
        },
        "error"
      );
      return;
    }

    if (Department) {
      this.service
        .add_Department_Api(Department, Status)
        .subscribe((response: any) => {
          this.get_departmentData_List()
          notify(
            {
              message: "Department Added successfully",
              position: { at: "top right", my: "top right" },
              displayTime: 500,
            },
            "success"
          );

          this.isAddPop = false;
          this.get_departmentData_List();
        });
    }
     else {
      notify(
        {
          message: "Please fill the field",
          position: { at: "top right", my: "top right" },
          displayTime: 500,
        },
        "error"
      );
    
      this.get_departmentData_List();
    }
  }
  //=============================open popup for add Department====================
  openPopup() {
    this.isAddPop = true;
  }
  //=============================close popup for add Department====================

  closePopup() {
    this.isAddPop = false;
    this.isEditPop = false;
  }

  //===========================On editing start====================

  onEditingStart(event: any) {
    event.cancel = true;
    this.editDepartmentData = event.data;
    console.log(this.editDepartmentData);
    
    this.isEditPop = true;
  }
  // ==================refresh data====================


  refreshData() {
    this.dataGrid.instance.refresh();
  }
  //=========================== Update Department ==============================
  update_Department_Data() {
    const Department = this.editDepartmentData.DEPARTMENT;
    const Status = this.editDepartmentData.IS_INACTIVE;
    const ID = this.editDepartmentData.ID;
    const isDuplicate = this.dataSource.some((item: any) => {
      return (
        item.DEPARTMENT.toLowerCase() === Department.toLowerCase() &&
        item.ID !== ID // Exclude the current department
      );
    });
    if (isDuplicate) {
      notify(
        {
          message: "Department already exists!",
          position: { at: "top right", my: "top right" },
          displayTime: 500,
        },
        "error"
      );
      return;
    }
    if(Department){
      this.service
      .update_Department_Api(ID, Department, Status)
      .subscribe((res: any) => {
        this.get_departmentData_List()
        
        console.log(res);
        notify(
          {
            message: "Department Updated successfully",
            position: { at: "top right", my: "top right" },
            displayTime: 500,
          },
          "success"
        );
        this.get_departmentData_List()
        

      });
   
    }
   else{
    this.get_departmentData_List()
    notify(
      {
        message: "Please fill the field",
        position: { at: "top right", my: "top right" },
        displayTime: 500,
      },
      "error"
    );
   }
    this.isEditPop = false;

    this.get_departmentData_List();
  }
  //================================ Delete Department============================
  delete_Department_Data(e: any) {
    const id = e.data.ID;
    this.service.delete_Department_Api(id).subscribe((res) => {
      this.get_departmentData_List();
    });
  }
  //======================== Export Data=================================

  onExporting(event: any) {
    console.log("event called")
    const fileName = 'file-name';
    this.service.exportDataGrid(event, fileName);
  }
}
