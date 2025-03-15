import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RoundedDirective,
  RowComponent,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyserviceService } from 'src/app/myservice.service';
import * as bootstrap from 'bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-view-collection',
  standalone: true,
  imports: [
    
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    RoundedDirective,
    RowComponent,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    IconDirective,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './view-collection.component.html',
  styleUrl: './view-collection.component.scss'
})
export class ViewCollectionComponent {
  collectionForm: FormGroup;

  dateFrom: string | null = null; // Store the "From" date
  dateTo: string | null = null;   // Store the "To" date
  collectionList:any;
  noData:any;
  collection: any;
  hospitals: any;
  gender: any;
  investigations: any;
  userId: any;
  selectedRange: string = '';  // The selected range (7, 15, 30, custom)
  // fromDate: string = '';       // The custom "From Date"
  // toDate: string = '';
  fromDate: Date | null = null;  // Initialize as null or Date
  toDate: Date | null = null;  
  customDate: string = ''; 
  currentPage: number = 1;
  itemsPerPage: number = 10;
  customStartDate: Date | null = null; // Allow null as a valid value
  customEndDate: Date | null = null;
  dataAvailable: boolean = true; 
  isModalOpen: boolean = false;
  today: string;
  filteredCollectionList: any[] = []; // Filtered list
  selectedColumn: string = ''; // Selected column for filtering
  filterValue: string = '';
  isCustomDateApplied: boolean = false; 

  constructor(private myservice: MyserviceService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ){
    const currentDate = new Date();
    this.today = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
    
    // Set the selectedRange to an empty string initially
    this.selectedRange = '';
    this.collectionForm = this.fb.group({
      collectionNo: [{ value: '', disabled: true }],
      patientName: [''],
      hospital: [''],
      uhid: [''],
      investigationReq: [''],
      natureSpecimen: [''],
      referredByDr: [''],
      referenceNo: [''],
      time: [{ value: '', disabled: true }],
      age: [''],
      sex: [''],
      income: [''],
      ward: [''],
      unit: [''],
      mobile: [''],
      clinicalData: [''],
      provisionalDiagnosis: [''],
      antibioticsPresent: [''],
      antibioticsPast: [''],
      otherInvestigations: [''],
      hospitalName:[''],
      description:[''],

    });
  }


  
  collectionData = [
    {
      collectionNo: '123',
      dateTime: '2024-11-21 10:00 AM',
      uhid: 'UH12345',
      patientName: 'John Doe',
      referenceNo: 'R12345',
      wardUnit: 'Ward A',
      investigation: 'Blood Test',
      referredBy: 'Dr. Smith',
      status: 'Completed',
    },
    // Add more data as needed
  ];

  ngOnInit(){
    this.userId = sessionStorage.getItem('userId');
    const today = new Date();
    this.dateFrom = this.formatDate(today); // Set dateFrom to today's date
    this.dateTo = this.formatDate(today);   // Set dateTo to today's date
    this.customStartDate = today;          // Set customStartDate to today's date
    this.customEndDate = today;
    this.getCollectionList('custom');
    this.getMastersList()
  }

  getMastersList(){
    this.myservice.getMastersList().subscribe((res:any)=>{
      const response=res;
      this.hospitals=res.Hospitals;
      this.gender= res.Sex;
      this.investigations= res.investigations;
      // console.log(this.hospitals,"HOSPITALS")
    })
  }

  getHospitalNameById(hospitalId: string): string {
    const selectedHospital = this.hospitals.find((hospital:any) => hospital.ID === hospitalId);
    return selectedHospital ? selectedHospital.HOSPITAL : '';
  }
  


  applyDateRange(days?: number) {
    if (days) {
      // Calculate date range based on predefined "days"
      this.getCollectionList(days.toString()); // Pass the number as a string to match the API
    } else {
      // Validate manually entered date range
      if (!this.dateFrom || !this.dateTo) {
        alert('Please select both From and To dates.');
        return;
      }
  
      // Ensure valid date range
      const fromDate = new Date(this.dateFrom);
      const toDate = new Date(this.dateTo);
  
      if (fromDate > toDate) {
        alert('The "From" date cannot be later than the "To" date.');
        return;
      }
  
      // Convert the string dates to Date objects before assigning
      this.customStartDate = fromDate;  // Assign as Date
      this.customEndDate = toDate;      // Assign as Date
      setTimeout(() => {
        window.location.reload();  // Reload the page
      }, 1000); 
      
      this.getCollectionList('custom'); // Call with 'custom' range
    }
  }
  

  onDateRangeChange(event:any) {
    // console.log('Selected value:', selectedValue); // Debug log
    if (this.selectedRange === 'custom') {
      // Temporarily clear `selectedRange` to allow re-selection

  
        // this.selectedRange = 'custom'; // Restore the "Custom" value
        this.openCustomDateModal();   // Open modal

      // setTimeout(() => {
      //   this.selectedRange = ''; // Clear the value to allow re-selection
      // });
    } else if (this.selectedRange === 'today') {
      console.log("Today is selected.");  // Debugging line
      // Handle 'today' explicitly to apply today's date range
      this.getCollectionList('today');  // Call getCollectionList with 'today'
    } else {
      console.log("Predefined range selected: ", this.selectedRange);  // Debugging line
      const predefinedDays = parseInt(this.selectedRange, 10); // Parse the selected value as an integer
      if (!isNaN(predefinedDays)) {
        this.applyDateRange(predefinedDays); // Call the function to apply predefined date range
      }
    }
    
  }

  resetCustomDate() {
    this.dateFrom = null;
    this.dateTo = null;
  }
  
  getCustomRange(): string {
    if (this.selectedRange === 'custom' && this.fromDate && this.toDate) {
      return `${this.formatDate(this.fromDate)} to ${this.formatDate(this.toDate)}`;
    } else {
      return 'Custom';  // Default value when not in custom mode
    }
  }
  
  openCustomDateModal() {
    const modalElement = document.getElementById('customDateModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Show the modal
    } else {
      console.error('Custom Date Modal element not found!');
    }
  }
  
  

  // Method to open the custom date range modal using Bootstrap Modal API
  // openCustomDateModal() {
  //   this.fromDate = null;
  //   this.toDate = null;
  //   const modal = new bootstrap.Modal(document.getElementById('customDateModal')!);
  //   modal.show(); 
  // }

// In the saveCustomDate method:
saveCustomDate() {
  if (this.fromDate && this.toDate) {
    if (new Date(this.fromDate) > new Date(this.toDate)) {
      alert("The 'From Date' cannot be later than the 'To Date'.");
      return;
    }
    this.customStartDate = new Date(this.fromDate);
    this.customEndDate = new Date(this.toDate);

    this.getCollectionList('custom');

    const modal = bootstrap.Modal.getInstance(document.getElementById('customDateModal')!);
    modal?.hide();
  } else {
    alert("Please select both 'From' and 'To' dates.");
  }
}




formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

  calculateDate(baseDate: Date, days: number): Date {
    const resultDate = new Date(baseDate);
    resultDate.setDate(resultDate.getDate() + days);
    return resultDate;
  }


  
  


  getCollectionList(range: string) {
    let dateFrom: string;
    let dateTo: string = this.formatDate(new Date()); // Default to today
  
    const today = new Date();
    
  
    switch (range) {
      case 'today':
        // Filter data for today
        dateFrom = this.formatDate(this.calculateDate(today, -0));// Set dateFrom to today's date (no offset)
        break;
      case '7':
        dateFrom = this.formatDate(this.calculateDate(today, -7)); // 7 days ago
        break;
      case '15':
        dateFrom = this.formatDate(this.calculateDate(today, -15)); // 15 days ago
        break;
      case '30':
        dateFrom = this.formatDate(this.calculateDate(today, -30)); // 30 days ago
        break;
      case 'custom':
        // If 'custom' range is selected, use custom start and end dates
        if (this.customStartDate && this.customEndDate) {
          dateFrom = this.formatDate(this.customStartDate); // Custom start date
          dateTo = this.formatDate(this.customEndDate); // Custom end date
        } else {
          // If custom dates are not provided, do nothing
          alert("Please select both 'From' and 'To' dates.");
          return;
        }
        break;
      default:
        alert("Invalid date range.");
        return;
    }
  
    const payload = {
      "USER_ID": this.userId,
      "DATE_FROM": dateFrom,
      "DATE_TO": dateTo
    };
  
    this.myservice.getCollectionList(payload).subscribe((response: any) => {
      this.collectionList = response.CollectionData;
      // console.log(this.collectionList, "RESPONSE");
      this.collectionList = this.collectionList.map((item: any) => {
        return {
          ...item,
          FORMATTED_DATE_TIME: this.formatDateTime(item.COLLECTION_DATE, item.COLLECTION_TIME) // Combine date and time
        };
      });
      this.filteredCollectionList = [...this.collectionList];
      if(this.collectionList.length === 0){
        this.dataAvailable = false;
      }
      else {
        this.dataAvailable = true;
      }
    });
  }
  


  formatDateTime(date: string, time: string): string {
    // Parse the date and time strings
    const datePart = new Date(date); // Extract the date part
    const timePart = new Date(time); // Extract the time part
  
    // Combine date and time into a single Date object
    const combinedDateTime = new Date(
      datePart.getFullYear(),
      datePart.getMonth(),
      datePart.getDate(),
      timePart.getHours(),
      timePart.getMinutes(),
      timePart.getSeconds()
    );
  
    // Format the combined date and time
    const day = String(combinedDateTime.getDate()).padStart(2, '0');
    const month = String(combinedDateTime.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = combinedDateTime.getFullYear();
    let hours = combinedDateTime.getHours();
    const minutes = String(combinedDateTime.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
  
    return `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }

openEditPopup(ID: number): void {
  this.isModalOpen = true;
  // Find the collection based on the ID
  const collection = this.collectionList.find((c: any) => c.ID === ID);
  // console.log('Collection found:', collection);
  const collectionDate = new Date(collection.COLLECTION_TIME);

// Manually format the date as dd-MM-yyyy hh:mm AM/PM
const day = String(collectionDate.getDate()).padStart(2, '0');
const month = String(collectionDate.getMonth() + 1).padStart(2, '0');
const year = collectionDate.getFullYear();
let hours = collectionDate.getHours();
let minutes = String(collectionDate.getMinutes()).padStart(2, '0');
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12; // the hour '0' should be '12'
const formattedTime = `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
console.log(formattedTime,"FORMATTEDTIME")



  
  if (collection) {

    
    // Populate the form fields with the selected collection data
    this.collectionForm.patchValue({
      ID: collection.ID,
      collectionNo: collection.COLLECTION_NO,
      patientName: collection.PATIENT_NAME,
      hospital: collection.HOSPITAL_ID,
      uhid: collection.UHID,
      referenceNo: collection.REFERENCE_NO,
      wardUnit: collection.WARD_UNIT,
      investigationReq: collection.INVESTIGATION_NAME,
      referredByDr: collection.DOCTOR_NAME,
      status: collection.STATUS_NAME,
      natureSpecimen: collection.SPECIMEN,
      time: formattedTime,
      age: collection.AGE,
      sex: collection.SEX,
      income: collection.INCOME,
      ward: collection.WARD,
      unit: collection.UNIT_NAME,
      mobile: collection.DOCTOR_MOBILE,
      clinicalData: collection.CLINICAL_DATA,
      provisionalDiagnosis: collection.DIAGNOSIS,
      antibioticsPresent: collection.ANTIBIOTIC_PRESENT,
      antibioticsPast: collection.ANTIBIOTIC_PAST,
      otherInvestigations: collection.OTHERS,
      hospitalName : collection.HOSPITAL_NAME,
      description: collection.DESCRIPTION,
  
    });
console.log(this.collectionForm
  ,"INEDIT")
  } else {
    console.error('Collection not found for ID:', ID);
  }
}

isFieldInvalid(field: string): boolean {
  const control = this.collectionForm.get(field);
  return control ? control.invalid && (control.touched || control.dirty) : false;
}

onClose() {
  // console.log("CLOSE")
  this.collectionForm.markAsPristine(); // Marks all controls as pristine
    this.collectionForm.markAsUntouched();
}

// onColumnChange() {
//   // When a new column is selected, reset the filter value
//   this.filterValue = '';
//   this.filterList();
// }
onFilterChange() {
  this.filterList();
}

filterList() {
  if (this.selectedColumn && this.filterValue) {
    this.filteredCollectionList = this.collectionList.filter((log:any) =>
      log[this.selectedColumn]?.toString().toLowerCase().includes(this.filterValue.toLowerCase())
    );
  } else {
    this.filteredCollectionList = [...this.collectionList];  // Reset to full list if no filter is applied
  }
}

onColumnChange() {
  // Reset the filter value whenever the column selection changes
  this.filterValue = '';
  
  // Optionally, you can also apply the filter here or in the `applyFilter` function
  this.applyFilter();
}

applyFilter() {
  if (this.selectedColumn && this.filterValue) {
    this.filteredCollectionList = this.collectionList.filter((log:any) =>
      log[this.selectedColumn]?.toString().toLowerCase().includes(this.filterValue.toLowerCase())
    );
  } else {
    // If no filter is applied, show all items
    this.filteredCollectionList = [...this.collectionList];
  }
}

viewPdf(log: any): void {
}


}
