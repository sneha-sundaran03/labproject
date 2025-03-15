import { Component, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxFormModule,
  DxPopupModule,
  DxSelectBoxModule,
} from "devextreme-angular";
import { DataserviceService } from "../../../../../services/dataservice.service";

@Component({
  selector: "app-antibiotic",
  standalone: true,
  imports: [
    DxDataGridModule,
    DxFormModule,
    DxSelectBoxModule,
    DxButtonModule,
    ReactiveFormsModule,
    DxPopupModule,
  ],
  templateUrl: "./antibiotic.component.html",
  styleUrl: "./antibiotic.component.scss",
})
export class AntibioticComponent {
   @ViewChild(DxDataGridComponent, { static: true })
     
     dataGrid!: DxDataGridComponent; 
  formsource!: FormGroup;
  isAddPopup: boolean = false;
  isEditPop: boolean = false;
  editAntibioticsData: any;
  dataSource: any 

  classification_Id:any
  classification_Name:any

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

  Antibiotic: any;

  classification: any;
  DESCRIPTION: any;

  constructor(private fb: FormBuilder ,private service:DataserviceService) {
    this.formsource = this.fb.group({
      Id: [null],
      Antibiotic: ["", [Validators.required]],
      classification: ["", [Validators.required]],
      display_Order:['',[Validators.required]],
      Status:[false,[Validators.required]]
    });

   this.get_Antibiotic_List()
   this.get_classification_List_Data()
  }

  formatStatus(data: any) {
    return data.IS_INACTIVE ? "Inactive" : "Active";
  }

  // =================get Classification list Data=================

  get_classification_List_Data(){

    this.service.get_Classification_list_Antibiotic(name).subscribe((res:any)=>{
      console.log(res);
      this.classification = res
      console.log(this.classification,"CLASSIFICATION")
      this.classification_Name=res.DESCRIPTION

      console.log(this.classification_Name);
      
    })
  }

  openPopup() {
    this.isAddPopup = true;
  }

  closePopup() {
  this.isAddPopup = false;
  this.isEditPop=false
  }

  onEditingStart(e: any) {
    e.cancel = true;
    this.editAntibioticsData = e.data;
    console.log(this.editAntibioticsData);

    this.isEditPop = true;
  }

  //==========================Event for Change value of classification==========
  onCLassificationSchemaChange(event:any){

this.classification_Id=event.value
console.log(event,"EVENT")
  }
  // ==================================Add Antibiotic====================
  Add_Antibiotic_Details(){
    const Antibiotic = this.formsource.value.Antibiotic;
    const CLASS_ID = this.formsource.value.classification_Id;
    const CLASS_NAME = this.formsource.value.classification_Id;
    const display_Order = this.formsource.value.display_Order;
    const Status = this.formsource.value.Status;



  }

// ==========================update Antibiotic=============================

  update_Antibiotics_Data() {
    const Antibiotics = this.editAntibioticsData.Antibiotic;
    const classification = this.editAntibioticsData.classification;
    const display_Order=this.editAntibioticsData.display_Order
    console.log(Antibiotics, classification,display_Order);
  }

  // ============================== Export file to Excel and PDG=========================
 
  onExporting(event: any) {
    console.log("event called")
    const fileName = 'file-name';
    this.service.exportDataGrid(event, fileName);
  }

  // ==========================Refresh================================
  refreshData() {
    console.log('refresh button clicked')
    this.dataGrid.instance.refresh();
  }


  // ============================get Antibiotic List============================


  get_Antibiotic_List(){
    this.service.get_Antibiotic_Details().subscribe((response:any)=>{
      if (response) {
        this.dataSource = response.Data;
        console.log(response.Data);
      }
    })
  }
  }