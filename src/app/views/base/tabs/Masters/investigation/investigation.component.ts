import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DxButtonModule, DxCheckBoxModule, DxDataGridComponent, DxFormModule, DxPopupModule } from 'devextreme-angular';
import { DxDataGridModule } from 'devextreme-angular';
// import { DataserviceService } from 'src/app/services/dataservice.service';
import { DataserviceService } from '../../../../../services/dataservice.service';
import notify from "devextreme/ui/notify";
@Component({
  selector: 'app-investigation',
  standalone: true,
  imports: [DxDataGridModule,DxButtonModule,DxPopupModule,ReactiveFormsModule,DxCheckBoxModule,DxFormModule,],
  templateUrl: './investigation.component.html',
  styleUrl: './investigation.component.scss'
})

export class InvestigationComponent {
  
  @ViewChild(DxDataGridComponent, { static: true })  
  dataGrid!: DxDataGridComponent; 
  editInvestigation:any=[]
  isAddPop:boolean=false
  isEditPop:boolean = false
  formsource!:FormGroup;
  dataSource: any
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



  constructor(private fb:FormBuilder,private service:DataserviceService){
    this.formsource=this.fb.group({
      id:[null],
      Investigation:['',[Validators.required]],
      status:[false,[Validators.required]]

    })
    this.get_investigation_List()

  }

  popupWidth: number = 500;

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


  //==============================default delete event Cancel=========

 
refreshData() {
this.dataGrid.instance.refresh()
}
openPopup() {
  this.isAddPop=true


}
closePopup() {
  this.isAddPop = false;
  this.isEditPop = false;
}

onExporting(event: any) {
  console.log("event called")
  const fileName = 'file-name';
  this.service.exportDataGrid(event, fileName);
}
formatStatus(data:any){
  return data.IS_INACTIVE ? "Inactive" : "Active";
}
selectInvestigation(event:any){
  const id=event.data.ID
  console.log(id);
  
 this.service.select_investigation_Api(id).subscribe((res:any)=>{
  console.log(res);
  
 })
}

  onEditingStart(event: any) {
    event.cancel = true;
    this.editInvestigation = event.data;
    console.log(this.editInvestigation);
    this.isEditPop = true;
    this.selectInvestigation(event)
  }



// ================= List all Investigation Details =============================================
  get_investigation_List(){
    this.service.get_Investigation_List().subscribe((res:any)=>{
      console.log(res);
      
      this.dataSource=res.Data
      console.log(this.dataSource);
      
    })
  }

  //======================== Add Investigation ===================================

  add_Investigation_Data(){

    const investigation=this.formsource.value.Investigation
    const status=this.formsource.value.status
    if(investigation){
      this.service.add_Investigation_Api(investigation,status).subscribe((res:any)=>{
        this.get_investigation_List()
        notify(
          {
            message: "Investigation Added successfully",
            position: { at: "top right", my: "top right" },
            displayTime: 500,
          },
          "success"
        );
    
      })
      this.isAddPop=false
    }
    else{
      notify(
        {
          message: "Please Fill the Field Completely",
          position: { at: "top right", my: "top right" },
          displayTime: 500,
        },
        "error"
      );
  
    }
   
  }

// =======================Update investigation Details========================

update_Invesigation_Details(){

  const id=this.editInvestigation.ID
  const Investigation=this.editInvestigation.INVESTIGATION
  const status=this.editInvestigation.IS_INACTIVE


if(Investigation){ 
   this.service.update_Investigation_Api(id,Investigation,status).subscribe((res)=>{
  this.get_investigation_List()

  notify(
    {
      message: "Investigation Added successfully",
      position: { at: "top right", my: "top right" },
      displayTime: 500,
    },
    "success"
  );
})
this.isEditPop=false
}
else{  notify(
  {
    message: "Please Fill the Field Completely",
    position: { at: "top right", my: "top right" },
    displayTime: 500,
  },
  "error"
);

}
  


}
// ========================Delete Investigation Details=============

delete_Investigation_Details(e:any){
  const id=e.data.ID
  this.service.delete_Investigation_Api(id).subscribe((res)=>{
    this.get_investigation_List()
    notify(
      {
        message: "Investigation Details Deleted successfully",
        position: { at: "top right", my: "top right" },
        displayTime: 500,
      },
      "success"
    );

  })
  

}
 

}
