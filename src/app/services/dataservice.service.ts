import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { exportDataGrid as exportDataGridToXLSX } from 'devextreme/excel_exporter';
import { jsPDF } from 'jspdf';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  constructor( private http: HttpClient) { }
  //base url
  private apiUrl="http://microapi.diligenzit.com/api/";

  getCollectionList(payload:any) {
    const getEndpoint = this.apiUrl+'/collection/collectionlist';
    return this.http.post(getEndpoint, payload);
  }
//============= get department data list ========
  get_DepartmentData_List() {
    const getEndpoint = this.apiUrl+'department/list';
    return this.http.post(getEndpoint, {});
  }

//==================== Api  for Add Department =============
add_Department_Api(department:any,isInactive:any){
  const getEndPoint=this.apiUrl+'department/insert'

  const reqbody = {
    "DEPARTMENT": department,
    "IS_INACTIVE": isInactive
  }
  return this.http.post(getEndPoint,reqbody)

}
//===================Api for update Department=============
update_Department_Api(id:any,department:any,isInactive:any){

  const getEndPoint = this.apiUrl + 'department/update'
  const reqbody = {
    
    "ID":id,
    "DEPARTMENT": department,
    "IS_INACTIVE": isInactive
  };
  return this.http.post(getEndPoint, reqbody);


}

// ================APi for Delete Department======================

delete_Department_Api(id:any){
const getEndPoint=this.apiUrl+`department/delete/${id}`;
return this.http.post(getEndPoint,{});

}
  //==============Export function==================  

  exportDataGrid(e: any, fileName: string) {
    
    if (e.format === 'pdf') {
      console.log('PDF export triggered');
      const doc = new jsPDF(); // Initialize jsPDF
      exportDataGridToPdf ({
        jsPDFDocument: doc,
        component: e.component,
      }).then(() => {
        doc.save(`${fileName}.pdf`); // Save the PDF file
      });
      e.cancel = true; // Cancel default behavior
    } else {
      const workbook = new Workbook(); // Initialize Excel workbook
      const worksheet = workbook.addWorksheet(fileName); // Create a worksheet
      exportDataGridToXLSX({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: 'application/octet-stream' }),
            `${fileName}.xlsx` // Save the Excel file
          );
        });
      });
      e.cancel = true; // Cancel default behavior
    }
  }

// =============APi for Get Investigation list================

get_Investigation_List(){

  const getEndPoint=this.apiUrl+`investigation/list`
  return this.http.post(getEndPoint,{})
}

// =============APi for Add Investigation Details================
add_Investigation_Api(investigation:any,isInactive:any){

  const getEndPoint=this.apiUrl+`investigation/insert`
  const reqbody = {
    "INVESTIGATION": investigation,
    "IS_INACTIVE": isInactive
  }
  return this.http.post(getEndPoint,reqbody)

}


// =============APi for Update Investigation list================



update_Investigation_Api(id:any,investigation:any,isInactive:any){

  const getEndPoint=this.apiUrl+`investigation/update`

  const reqbody = {
    
    "ID":id,
    "INVESTIGATION": investigation,
    "IS_INACTIVE": isInactive
  };
  return this.http.post(getEndPoint,reqbody)

}


// =============APi for Delete Investigation list================


delete_Investigation_Api(id:Number){

  const getEndPoint=this.apiUrl+`investigation/delete/${id}`

  return this.http.post(getEndPoint,{})
}

// =============APi for Select Investigation list================


select_investigation_Api(id:any){

  const getEndPoint=this.apiUrl+`investigation/select/${id}`
  return this.http.post(getEndPoint,{})

}
 //=============================Api for Classification list =======================
 
 get_Classification_list_Antibiotic(type: any){
  const getEndPoint=this.apiUrl+`dropdown`
  

  const reqbody = {NAME:"ANITIBIOTIC_CLASS"}
    return this.http.post(getEndPoint,reqbody)
  
 }




// ===================================Api List Antibiotic Details===============================

get_Antibiotic_Details(){
  const getEndPoint=this.apiUrl+`antibiotic/list`
  return this.http.post(getEndPoint,{})
}

// ================================Api For Add Antibiotic Details=======================

add_Antibiotic_Details(Antibiotic:any,classid:any,classname:any,display_order:any,isInactive:any){

  const getEndPoint=this.apiUrl+`antibiotic/insert`

  
  const reqbody = {
    
    "ANTIBIOTIC": Antibiotic,
    "CLASS_ID":classid,
    "CLASS_NAME":classname,
    "IS_INACTIVE": isInactive,
    "DISPLAY_ORDER":display_order
  };
  return this.http.post(getEndPoint,reqbody)




}

}




