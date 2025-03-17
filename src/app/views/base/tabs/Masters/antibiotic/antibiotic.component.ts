import { Component, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  DxButtonModule,
  DxCheckBoxModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxFormModule,
  DxNumberBoxModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxTextBoxModule,
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
    DxTextBoxModule,
    DxNumberBoxModule ,
    DxCheckBoxModule
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

    classification_Details:any
    Antibiotic: any;

    classification: any;
    DESCRIPTION: any;
    class_id:any
    class_name:any

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


  constructor(private fb: FormBuilder ,private service:DataserviceService) {
    this.formsource = this.fb.group({
      Id: [null],
      Antibiotic: ["", [Validators.required]],
      classification: ["", [Validators.required]],
      display_order:['',[Validators.required]],
      IS_INACTIVE: [false, [Validators.required]] 
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
 
    })
  }

  openPopup() {
    this.isAddPopup = true;
  }

  closePopup() {
  this.isAddPopup = false;
  this.isEditPop=false
  }

  // onEditingStart(e: any) {
  //   e.cancel = true;
  //   this.editAntibioticsData = e.data;
  //   console.log(this.editAntibioticsData);

  //   this.isEditPop = true;
  // }

  //==========================Event for Change value of classification==========

  onEditingStart(e: any) {
    e.cancel = true; // Prevents default editing behavior
    this.editAntibioticsData = e.data; // Store the selected antibiotic details
    console.log("Editing Data:", this.editAntibioticsData);
  
    // Ensure formsource is patched with the new data
    this.formsource.patchValue({
      Antibiotic: e.data.ANTIBIOTIC,
      classification: {
        ID: e.data.CLASS_ID,
        DESCRIPTION: e.data.CLASS_NAME,
      },
      display_Order: e.data.DISPLAY_ORDER,
      IS_INACTIVE: e.data.IS_INACTIVE,
    });
  
    this.isEditPop = true; // Show the edit popup
  }
  
onCLassificationSchemaChange(event: any) {
  console.log(event, "EVENT");

  // Find the full classification object
  const selectedClassification = this.classification.find(
    (item: any) => item.ID === event.value
  );

  console.log(selectedClassification, "SELECTED CLASSIFICATION");

  if (selectedClassification) {
    this.classification_Details = selectedClassification;

    // Correctly update form fields
    this.formsource.patchValue({
      classification: selectedClassification, // Store the full object in the form
    });

    console.log("Updated Form:", this.formsource.value);
  }
}

  // ==================================Add Antibiotic====================

Add_Antibiotic_Details() {
  const formValues = this.formsource.value;
  const Antibiotic = formValues.Antibiotic;
  const selectedClassification = formValues.classification; 
  const classid = selectedClassification?.ID 
  const classname = selectedClassification?.DESCRIPTION 
  const display_order = formValues.display_order;
  const isInactive = formValues.IS_INACTIVE; // Boolean

  console.log("Final Data:", {
    Antibiotic,
    classid,
    classname,
    display_order,
    isInactive 
  });
this.service.add_Antibiotic_Details(Antibiotic,classid,classname,display_order,isInactive).subscribe((res:any)=>{
  console.log(res);
   this.get_Antibiotic_List()
}
)// Now send this data to your API or perform further actions.
}

// ==========================update Antibiotic=============================

  update_Antibiotics_Data() {

    const Antibiotic = this.editAntibioticsData.ANTIBIOTIC;
    const classid = this.editAntibioticsData.CLASS_ID;
    const classname = this.editAntibioticsData.CLASS_NAME;
    const display_order = this.editAntibioticsData.DISPLAY_ORDER;
    const isInactive = this.editAntibioticsData.IS_INACTIVE;
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