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
// import {MyserviceService} from 'src/app/myservice.service';
import { MyserviceService } from '../../../myservice.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  providers: [MyserviceService],
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
  ]
})

export class AppTabsComponent{

  dateFrom: string | null = null; // Store the "From" date
  dateTo: string | null = null;   // Store the "To" date
  collectionList:any;
  noData:any;
  
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

  collectionForm = this.fb.group({
    collectionNo: [''],
    patientName: ['', Validators.required],
    hospital: ['', Validators.required],
    uhid: ['', Validators.required],
    investigationReq: ['', Validators.required],
    natureSpecimen: ['', Validators.required],
    referredByDr: ['', Validators.required],
    referenceNo: ['', Validators.required],
    time: ['', Validators.required],
    age: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    sex: ['', Validators.required],
    income: ['', Validators.required],
    ward: ['', Validators.required],
    unit: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    clinicalData: ['', Validators.required],
    provisionalDiagnosis: ['', Validators.required],
    antibioticsPresent: ['', Validators.required],
    antibioticsPast: ['', Validators.required],
    otherInvestigations: ['', Validators.required]
  });

  constructor(private service:MyserviceService,private fb: FormBuilder) {
    // Initialize the form
  }

  applyDateRange() {
    console.log(this.dateFrom,this.dateTo,"datefrom,dateto");
    // Validate the dates
    if (!this.dateFrom || !this.dateTo) {
      alert('Please select both dates.');
      return;
    }

    const payload = {
      DEPT_ID: 1,
      USER_ID: 1,
      DATE_FROM: this.dateFrom,
      DATE_TO: this.dateTo
    };
    
    this.service.getCollectionList(payload).subscribe(
      (res: any) => {
        this.collectionList = res.CollectionData;
        
        // Check if no data is returned
        if (this.collectionList && this.collectionList.length === 0) {
          this.noData = true; // Set a flag for 'No Data'
        } else {
          this.noData = false; // Reset the flag if data exists
        }
      },
      (error: any) => {
        console.error('Error fetching data', error);
        this.noData = true; // Show 'No Data' on error
      }
    );
    

  }

 

  onSave() {
    // Mark all controls as touched to trigger validation messages
    Object.keys(this.collectionForm.controls).forEach(field => {
      const control = this.collectionForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  
    // Check if the form is valid
    if (this.collectionForm.valid) {
      console.log('Form data: ', this.collectionForm.value);
      // Handle form submission
    } else {
      console.log('Form is invalid');
    }
  }

  onClose(): void {
    this.collectionForm.reset();
    this.collectionForm.markAsPristine(); // Marks all controls as pristine
    this.collectionForm.markAsUntouched(); // Marks all controls as untouched
  }
}


