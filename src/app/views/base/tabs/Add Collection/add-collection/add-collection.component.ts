import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
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
  TabsListComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
// import { MyserviceService } from 'src/app/myservice.service';
import { MyserviceService } from '../../../../../myservice.service';
import { DxPopupModule, DxButtonModule } from 'devextreme-angular';
import * as bootstrap from 'bootstrap';
import {  ValidationErrors } from '@angular/forms';

function mobileStartsWithZeroValidator(control: AbstractControl): ValidationErrors | null {
  if (control.value && control.value.startsWith('0')) {
    return { startsWithZero: true };
  }
  return null;
}

@Component({
  selector: 'app-add-collection',
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
    DxPopupModule,
    DxButtonModule,
  ],
  templateUrl: './add-collection.component.html',
  styleUrl: './add-collection.component.scss',
})


export class AddCollectionComponent implements OnInit {

  
  dateFrom: string | null = null; // Store the "From" date
  dateTo: string | null = null; // Store the "To" date
  collectionList: any;
  noData: any;
  hospitals: any;
  gender: any;
  investigations: any;
  currentTime: any;
  isSuccessPopupVisible: boolean = false;
  showTextBox = false;
  isLoading = false;
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
    collectionNo: [{ value: '', disabled: true }],
    patientName: ['', [Validators.required, Validators.maxLength(100)]],
    hospital: ['', [Validators.required, Validators.maxLength(100)]],
    uhid: ['', [Validators.required, Validators.maxLength(25)]],
    investigationReq: ['', [Validators.required]],
    natureSpecimen: ['', [Validators.required]],
    referredByDr: ['', [Validators.maxLength(100)]],  // Removed the second maxLength(25)
    referenceNo: ['', [Validators.maxLength(50)]],
    time: [{ value: this.getCurrentDateTime(), disabled: true }],
    age: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    sex: ['', [Validators.required, Validators.maxLength(10)]],  // Corrected maxLength(10)
    income: ['', [Validators.maxLength(152)]],
    ward: ['', [Validators.required, Validators.maxLength(25)]],
    unit: ['', [Validators.required, Validators.maxLength(25)]],
    // mobile: ['', [Validators.required,Validators.pattern('^[0-9]{10}$'), Validators.maxLength(25)]],  // Corrected order of validators
    mobile: [
      '',
      [
        Validators.required,
        Validators.pattern('^[0-9]*$'), // Ensures only numbers are entered
        Validators.pattern(/^\d+$/),
        Validators.minLength(10),
        Validators.maxLength(10),
        mobileStartsWithZeroValidator,
      ]
    ],
    clinicalData: ['', [Validators.maxLength(2000)]],
    provisionalDiagnosis: ['', [Validators.maxLength(2000)]],
    antibioticsPresent: ['', [Validators.maxLength(2000)]],
    antibioticsPast: ['', [Validators.maxLength(2000)]],
    otherInvestigations: ['', [Validators.maxLength(2000)]],
    previousResult: ['', [Validators.maxLength(2000)]],
    otherInvestigation:['', [Validators.required, Validators.maxLength(2000)]],
  });
  
  userId: any;
  timeInterval: any;
  selectedEndpoint: any;
  collectionNumber: any;
  collectionNo: any;
  investigationId: any;
  investigationName: any;

  // Custom validator to check for negative age
  noNegativeAgeValidator(control: AbstractControl) {
    if (control.value && control.value < 0) {
      return { invalidAge: true };
    }
    return null;
  }

  constructor(private service: MyserviceService, private fb: FormBuilder) {
    this.getCurrentDateTime();
    // Initialize the form
  }

  isFieldInvalid(field: string): boolean {
    const control = this.collectionForm.get(field);
    return control
      ? control.invalid && (control.touched || control.dirty)
      : false;
  }

  onHospitalChange(event: any): void {
    const selectedHospitalId = event.target.value;
    console.log('Selected Hospital ID:', selectedHospitalId);

  }

  get mobileErrors() {
    const mobile = this.collectionForm.get('mobile');
    if (mobile?.hasError('startsWithZero')) {
      return 'Mobile number cannot start with 0.';
    }
    if (mobile?.hasError('pattern')) {
      return 'Only numeric values are allowed.';
    }
    if (mobile?.hasError('minlength')) {
      return 'Mobile number must be at least 10 digits.';
    }
    if (mobile?.hasError('maxlength')) {
      return 'Number should not be greater than 10 digits.';
    }

    return null;
  }
  

  onMobileKeyUp(event: any) {
    const inputValue = event.target.value;
    if (inputValue.length > 10) {
      event.target.value = inputValue.slice(0, 10); // Truncate if more than 10 characters
    }
  }

  applyDateRange() {
    // console.log(this.dateFrom,this.dateTo,"datefrom,dateto");
    // Validate the dates
    if (!this.dateFrom || !this.dateTo) {
      alert('Please select both dates.');
      return;
    }

    const payload = {
      USER_ID: 1,
      DATE_FROM: this.dateFrom,
      DATE_TO: this.dateTo,
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
  // logSelectedValue(): void {
  //   const selectedValue = this.collectionForm.get('investigationReq')?.value;
  //   if (selectedValue === '0') {
  //     this.showTextBox = true; // Show the text box if ID is 0
  //   } else {
  //     this.showTextBox = false; // Hide the text box for other IDs
  //   }
  //   if (selectedValue) {
  //     // Find the selected investigation object
  //     const selectedInvestigation = this.investigations.find(
  //       (inv: any) => inv.ID === +selectedValue
  //     );
  //   } else {
  //     console.log('No investigation selected');
  //   }
  // }
  logSelectedValue(): void {
    const selectedValue = this.collectionForm.get('investigationReq')?.value;

    // If "Other Investigation" is selected (ID === 0), show the text box and make it mandatory
    if (selectedValue === '0') {
      this.showTextBox = true;
      // Add 'required' validation to the 'otherInvestigation' field
      this.collectionForm.get('otherInvestigation')?.setValidators([Validators.required]);
    } else {
      this.showTextBox = false;
      // Remove 'required' validation from the 'otherInvestigation' field
      this.collectionForm.get('otherInvestigation')?.clearValidators();
    }

    // Update the validity of the 'otherInvestigation' field
    this.collectionForm.get('otherInvestigation')?.updateValueAndValidity();
  }

  // Optional: Handle changes to the 'Other Investigation' text field (if needed)
  // onOtherInvestigationChange(event: any): void {
  //   console.log('Other Investigation changed:', event.target.value);
  // }
  onOtherInvestigationChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.investigationName = inputElement.value;
    // console.log('Other Investigation Changed:', this.investigationName);
  }

  onSave() {
    Object.keys(this.collectionForm.controls).forEach((field) => {
      const control = this.collectionForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    if (this.collectionForm.valid) {
      this.isLoading = true;

      console.log('Selected Hospital ID:', this.collectionForm.value.hospital);
      console.log('Investigation ID:', this.collectionForm.value.investigationReq);
  
      this.investigationId = this.collectionForm.value.investigationReq;
      if (this.investigationId == null || this.investigationId === '') {
        return;
      }
      const selectedInvestigation = this.investigations.find(
        (investigation: any) => investigation.ID === +this.investigationId 
      );
      if (selectedInvestigation) {
        if (+this.investigationId === 0) {
          this.investigationName = this.investigationName;
        } else {
          this.investigationName = selectedInvestigation.INVESTIGATION;
        }
      }
      const data = {
        COLLECTION_DATE: this.getCurrentDateTime(),
        COLLECTION_TIME: this.getCurrentDateTime(),
        REFERENCE_NO: this.collectionForm.value.referenceNo,
        PATIENT_NAME: this.collectionForm.value.patientName,
        AGE: this.collectionForm.value.age,
        SEX: this.collectionForm.value.sex,
        HOSPITAL_ID: this.collectionForm.value.hospital,
        UNIT_NAME: this.collectionForm.value.unit,
        WARD: this.collectionForm.value.ward,
        UHID: this.collectionForm.value.uhid,
        INCOME: this.collectionForm.value.income,
        SPECIMEN: this.collectionForm.value.natureSpecimen,
        DESCRIPTION: this.collectionForm.value.natureSpecimen,
        DIAGNOSIS: this.collectionForm.value.provisionalDiagnosis,
        ANTIBIOTIC_PRESENT: this.collectionForm.value.antibioticsPresent,
        ANTIBIOTIC_PAST: this.collectionForm.value.antibioticsPast,
        INVESTIGATION_ID: this.collectionForm.value.investigationReq,
        INVESTIGATION_NAME: this.investigationName,
        OTHERS: this.collectionForm.value.otherInvestigations,
        USER_ID: this.userId,
        DOCTOR_NAME: this.collectionForm.value.referredByDr,
        DOCTOR_MOBILE: this.collectionForm.value.mobile,
        PREVIOUS_RESULT: this.collectionForm.value.previousResult
      };
    
      this.service.insertCollectionData(data).subscribe((res: any) => {

        if (res.flag === 1) {
          this.isLoading = false;
          this.collectionNumber = res.CollectionData[0].COLLECTION_NO; // or the appropriate key for your response
          const endpoint = res.endpoint; // If you also need the endpoint for logging or other use cases
          this.fetchCollectionNo();
          // console.log('Collection Number:', this.collectionNumber);
          // console.log('Endpoint:', endpoint);
          this.showSuccessModal(this.collectionNumber);
        }
      });
    } else {
      // console.log(this.collectionForm);
      console.log('Form is invalid');
    }
  }

  showSuccessModal(collectionNumber: string) {
    // console.log("HIIII")
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Show the modal
    }
    this.onClose();
  }

  fetchCollectionNo() {
    this.service.getCollectionNo().subscribe((response: any) => {
      this.collectionNo = response.CollectionData[0].COLLECTION_NO;
      // console.log(this.collectionNo);
      this.collectionForm.patchValue({
        collectionNo: this.collectionNo, // Update the form control value
      });
    });
  }

  onClose(): void {
    this.fetchCollectionNo();
    // Update the 'time' field with the current time
    const currentTime = this.getCurrentDateTime();

    // Reset the form and also include disabled fields
    this.collectionForm.reset();

    // Update the 'time' field value and ensure it remains disabled
    this.collectionForm.patchValue({
      time: currentTime,
    });
    this.collectionForm.get('time')?.disable(); // Disable the 'time' field again

    // Mark the form as pristine and untouched
    this.collectionForm.markAsPristine();
    this.collectionForm.markAsUntouched();

    // Update form validity
    this.collectionForm.updateValueAndValidity();
  }

  getMastersList() {
    this.service.getMastersList().subscribe((res: any) => {
      const response = res;
      this.hospitals = res.Hospitals;
      this.gender = res.Sex;
      this.investigations = res.investigations;
      console.log(res, 'INVESTIGATIONS');
    });
  }

  private getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[now.getMonth()];
    const date = now.getDate().toString().padStart(2, '0');

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format and handle midnight as 12.

    return `${date}-${month}-${year} ${hours
      .toString()
      .padStart(2, '0')}:${minutes} ${ampm}`;
  }

  startTimeUpdate() {
    // Update the time every second (1000ms)
    this.timeInterval = setInterval(() => {
      const currentTime = this.getCurrentDateTime(); // Use your custom function
      this.collectionForm.patchValue({
        time: currentTime,
      });
    }, 1000); // 1000 milliseconds = 1 second
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed to avoid memory leaks
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  ngOnInit(): void {
    this.startTimeUpdate();

    this.userId = sessionStorage.getItem('userId');
    this.fetchCollectionNo();
    this.getMastersList();
  }
}
