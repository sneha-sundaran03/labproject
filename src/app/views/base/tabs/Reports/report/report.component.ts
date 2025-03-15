import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
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
// import {MyserviceService} from 'src/app/myservice.service';
import { MyserviceService } from '../../../../../myservice.service';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {
  DxButtonModule,
  DxCheckBoxModule,
  DxDataGridModule,
  DxDropDownBoxModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxTabPanelModule,
  DxTabsModule,
  DxTextBoxModule,
} from 'devextreme-angular';
import { DxoItemModule } from 'devextreme-angular/ui/nested';
interface ReportData {
  COLLECTION_ID: number;
  ZIEHEL_STAIN: string;
  SPECIAL_STAIN: string;
  CULTURE: string;
  REMARKS: string;
  ISOLATE1_IDENTIFICATION: string;
  ISOLATE1_GROWTH_RATE: string;
  ISOLATE1_COLONY_COUNT: string;
  ISOLATE2_IDENTIFICATION: string;
  ISOLATE2_GROWTH_RATE: string;
  ISOLATE2_COLONY_COUNT: string;
  ISOLATE3_IDENTIFICATION: string;
  ISOLATE3_GROWTH_RATE: string;
  ISOLATE3_COLONY_COUNT: string;
  IS_PRELIMINERY: any;
  IS_PUBLISHED: any;
  USER_ID: number;
  ReportEntry: Array<{
    ANTIBIOTIC_ID: number;
    ISOLATE1: string;
    ISOLATE2: string;
    ISOLATE3: string;
    ADDL_INFO: string;
    REMARKS: string;
  }>;
  ReportGramStain: Array<{
    GRAM_STAIN: string;
    PRESENCE: string;
  }>;
  ReportWetFilm: Array<{
    WET_FILM: string;
    PRESENCE: string;
  }>;
}

@Component({
  selector: 'app-report',
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
    ReactiveFormsModule,
    DxTextBoxModule,
    DxTabsModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxPopupModule,
    DxoItemModule,
    DxTabPanelModule,
    DxCheckBoxModule,
    DxDropDownBoxModule
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReportComponent implements OnInit {
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  reportForm!: FormGroup;
  collectionNumber: any;
  hospitals: any = {};
  selectedTabIndex = 0;
  tabs = [{ text: 'Microscopy' }, { text: 'Antibiotic Susceptibility (AST)' }];
  microscopyData = [
    { item: 'Bacteria', presence: '' },
    { item: 'Yeast Cells', presence: '' },
  ];
  gramStainData = [
    { item: 'Bacteria', presence: '' },
    { item: 'Yeast Cells', presence: '' },
  ];
  antibioticSusceptibility = [
    {
      Antibiotic: '',
      Isolate1: '',
      Isolate2: '',
      Isolate3: '',
      AdditionalInfo: '',
      antibioticRemarks: '',
    },
  ];
  wetFilm: any;
  wetFilmResult: any;
  gramStain: any;
  gramStainResult: any;
  remarks: any;
  selectedRemark: number | null = null;
  isolate: any;
  selectedIsolate1: number | null = null;
  selectedIsolate2: number | null = null;
  selectedIsolate3: number | null = null;
  antibiotics: any[] = [];
  antibioticData: any;
  gender: any;
  investigations: any;
  selectedHospital: any; // Store selected hospital ID
  selectedGender: number | null = null; // Store selected gender ID
  selectedInvestigation: any;
  pendingCollection: any;
  selectedCollectionNo: any;
  selectedPatientName: any;
  selectedReferenceNo: any;
  age: any;
  sex: any;
  ward: any;
  selectedAge: any;
  selectedSex: any;
  selectedWard: any;
  selectedDr: any;
  selectedSpecimen: any;
  selectedUnit: any;
  selectedUhid: any;
  currentTime: string = '';
  isPopupVisible: boolean = false;
  selectedRowKeys: any;
  sensitivity: any;
  ziehlNeelsenStain: string = '';

  reportData: ReportData = {
    COLLECTION_ID: 0,
    ZIEHEL_STAIN: '',
    SPECIAL_STAIN: '',
    CULTURE: '',
    REMARKS: '',
    ISOLATE1_IDENTIFICATION: '',
    ISOLATE1_GROWTH_RATE: '',
    ISOLATE1_COLONY_COUNT: '',
    ISOLATE2_IDENTIFICATION: '',
    ISOLATE2_GROWTH_RATE: '',
    ISOLATE2_COLONY_COUNT: '',
    ISOLATE3_IDENTIFICATION: '',
    ISOLATE3_GROWTH_RATE: '',
    ISOLATE3_COLONY_COUNT: '',
    IS_PRELIMINERY: 0,
    IS_PUBLISHED: 0,
    USER_ID: 0,
    ReportEntry: [],
    ReportGramStain: [],
    ReportWetFilm: [],
  };
  userId: any;
  collectionTime: any;
  isDarkTheme = false; 

  isGridBoxOpened: boolean = false;

  // Sample Data
  collectionNos = [
    { CollectionNo: 'COL123', Description: 'Sample 1' },
    { CollectionNo: 'COL456', Description: 'Sample 2' },
    { CollectionNo: 'COL789', Description: 'Sample 3' }
  ];

  constructor(private fb: FormBuilder, private myService: MyserviceService) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
    // console.log(this.userId, 'USERID');
    this.getMicroscopyDataInTab();
    this.getMastersList();
    this.getPendingCollections();
  }


  onCollectionSelected(event: any) {
    if (event.selectedRowsData.length > 0) {
      this.selectedCollectionNo = event.selectedRowsData[0].CollectionNo;
      this.isGridBoxOpened = false; // Close dropdown after selection
    }
  }
  onCollectionNoChanged(event: any) {
    this.selectedCollectionNo = event.value;
  }

  getTextColor() {
    return this.isDarkTheme ? 'text-light' : 'text-dark';
  }

  getMicroscopyDataInTab() {
    this.myService.getMicroscopyData().subscribe((response: any) => {
      // console.log(response, 'RESPONSE');

      this.sensitivity = response.Sensitivity;
      this.wetFilm = response.WetFilm;
      this.wetFilmResult = response.WetFilmResult; // This is used as a lookup dropdown data source

      this.microscopyData = this.wetFilm.map((item: any, index: number) => ({
        item: item.Description, // Populating 'Item' column
        wetFilmResult:
          response.WetFilmResult?.find(
            (res: any) => res.Description === item.Presence
          )?.Description || '',
      }));

      this.gramStain = response.GramStain;
      this.gramStainResult = response.GramStainResult;
      this.gramStainData = this.gramStain.map((item: any, index: any) => ({
        item: item.Description,
        presence:
          response.GramStainResult?.find(
            (res: any) => res.Description === item.Presence
          )?.Description || '',
      }));

      this.remarks = response.Remarks || [];
      if (this.remarks.length > 0) {
        this.reportData.REMARKS = this.remarks[0].Id;
      }
      // console.log(this.remarks, 'REMARKSSSSSSSSSSS');
      this.isolate = response.Isolate || [];
      if (this.isolate.length > 0) {
        this.reportData.REMARKS = this.isolate[0].Id;
      }
      this.antibioticData = response.Antibiotic;
      this.antibiotics = this.antibioticData.map((antibiotic: any) => ({
        Antibiotic: antibiotic.Description,
        antibioticId: antibiotic.Id,
      }));

      // console.log(this.microscopyData, 'MICROSCOPY DATA');
    });
  }

  onRemarkValueChanged(e: any) {
    // console.log('Selected Remark Id:', e.value);
    this.reportData.REMARKS = e.value;
  }
  onIsolate1ValueChanged(e: any) {
    // console.log('Selected Remark Id:', e.value);
    this.reportData.ISOLATE1_IDENTIFICATION = e.value;
  }
  onIsolate2ValueChanged(e: any) {
    // console.log('Selected Remark Id:', e.value);
    this.reportData.ISOLATE2_IDENTIFICATION = e.value;
  }
  onIsolate3ValueChanged(e: any) {
    // console.log('Selected Remark Id:', e.value);
    this.reportData.ISOLATE3_IDENTIFICATION = e.value;
  }

  updateSelectedPresence(event: any) {
    const updatedItem = event.data.item; // Get the Item value
    const updatedPresence = event.data.presence; // Corrected field name

    // console.log(
    //   `Updated Item: ${updatedItem}, Selected Presence: ${updatedPresence}`
    // );

    // Find and update the correct entry in microscopyData
    const index = this.microscopyData.findIndex(
      (row: any) => row.item === updatedItem
    );
    if (index !== -1) {
      this.microscopyData[index].presence = updatedPresence;
    }
    // Update the corresponding entry in ReportWetFilm
    this.reportData.ReportWetFilm[index] = {
      WET_FILM: updatedItem,
      PRESENCE: updatedPresence,
    };
    // console.log('Updated ReportWetFilm:', this.reportData.ReportWetFilm);
  }

  updateGramPresence(event: any) {
    const updatedItem = event.data.item;
    const selectedPresence = event.data.presence;

    // Find the index of the updated item in the gramStainData array
    const index = this.gramStainData.findIndex(
      (row: any) => row.item === updatedItem
    );
    if (index !== -1) {
      // Update the presence value in the data array
      this.gramStainData[index].presence = selectedPresence;
    }

    // console.log(
    //   `Updated Item: ${updatedItem}, Selected Presence: ${selectedPresence}`
    // );
    this.reportData.ReportGramStain[index] = {
      GRAM_STAIN: updatedItem,
      PRESENCE: selectedPresence,
    };

    // Log the updated ReportGramStain array
    // console.log('Updated ReportGramStain:', this.reportData.ReportGramStain);
    // Perform additional actions as needed, such as enabling a save button
  }

  updateSelectedAntibiotic(event: any) {
    console.log('EVENT:', event);

    // Extract the updated values
    const updatedItem = event.data.Antibiotic;
    const isolate1 = event.data.presence;
    const isolate2 = event.data.Isolate2;
    const isolate3 = event.data.Isolate3;
    const additionalInfo = event.data.AdditionalInfo;
    // const remarks = event.data.Remarks;
    const antibioticId = event.data.antibioticId;
    const antibioticRemarks = event.data.antibioticRemarks

    // Ensure `reportData.ReportEntry` is initialized
    if (!Array.isArray(this.reportData.ReportEntry)) {
      this.reportData.ReportEntry = [];
    }

    console.log('Before update:', this.reportData.ReportEntry);

    // Create a new entry object
    const newEntry = {
      ANTIBIOTIC_ID: antibioticId,
      ISOLATE1: isolate1,
      ISOLATE2: isolate2,
      ISOLATE3: isolate3,
      ADDL_INFO: additionalInfo,
      REMARKS: antibioticRemarks,
    };

    // Find index of existing entry
    const existingIndex = this.reportData.ReportEntry.findIndex(
      (entry: any) => entry.ANTIBIOTIC_ID === antibioticId
    );

    if (existingIndex !== -1) {
      // Update existing entry
      this.reportData.ReportEntry[existingIndex] = newEntry;
    } else {
      // Push a new entry
      this.reportData.ReportEntry.push(newEntry);
    }

    // console.log('Updated Report Entry:', this.reportData.ReportEntry);
  }

  getPendingCollections() {
    this.myService.getPendingCollectionData().subscribe((response: any) => {
      // console.log(response, 'PENDING COLLECTION');
      this.pendingCollection = response.PendingCollectionData;
    });
  }
  onCollectionChange() {
    if (this.selectedRowKeys.length > 0) {
      const selectedCollection = this.pendingCollection.find(
        (item: any) => item.ID === this.selectedRowKeys[0]
      );

      if (selectedCollection) {
        this.selectedCollectionNo = selectedCollection.COLLECTION_NO;
        this.selectedPatientName = selectedCollection.PATIENT_NAME;
        this.selectedHospital = selectedCollection.HOSPITAL;
        this.selectedReferenceNo = selectedCollection.REFERENCE_NO;
        this.selectedAge = selectedCollection.AGE;
        this.selectedSex = selectedCollection.SEX;
        this.selectedWard = selectedCollection.WARD;
        this.selectedDr = selectedCollection.DOCTOR_NAME;
        this.selectedSpecimen = selectedCollection.SPECIMEN;
        this.selectedUnit = selectedCollection.UNIT_NAME;
        this.selectedUhid = selectedCollection.UHID;
        this.selectedInvestigation = selectedCollection.INVESTIGATION_NAME;
        this.collectionTime = this.formatDate(
          selectedCollection.COLLECTION_DATE
        );

        this.reportData.COLLECTION_ID = selectedCollection.COLLECTION_NO;

        // Capture the current time
        const now = new Date();
        this.currentTime = now.toLocaleTimeString();

        // console.log(this.selectedInvestigation, 'investigationnnnnnnnnnn');
      }
      this.isPopupVisible = false;
    } else {
      // console.log('No row selected.');
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const formattedDate = `${this.padZero(date.getDate())}-${this.padZero(
      date.getMonth() + 1
    )}-${date.getFullYear()} ${this.padZero(
      date.getHours()
    )}:${this.padZero(date.getMinutes())}:${this.padZero(date.getSeconds())} `;
    return formattedDate;
  }

  // Helper function to add zero padding
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  onIsolateChange(event: any, rowIndex: number) {
    this.antibiotics[rowIndex].Isolate1 = event.value;
  }

  getMastersList() {
    this.myService.getMastersList().subscribe((res: any) => {
      const response = res;
      this.gender = res.Sex.map((sex: any) => ({
        ID: sex.ID,
        Description: sex.DESCRIPTION, // Map DESCRIPTION field correctly
      }));
      this.investigations = res.investigations.map((investigation: any) => ({
        ID: investigation.ID,
        INVESTIGATION: investigation.INVESTIGATION,
      }));

      this.hospitals = res.Hospitals.map((hospital: any) => ({
        ID: hospital.ID,
        DESCRIPTION: hospital.HOSPITAL, // Map 'HOSPITAL' to 'DESCRIPTION'
      }));
      // console.log(res, 'INVESTIGATIONS');
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.reportForm.get(field);
    return control
      ? control.invalid && (control.touched || control.dirty)
      : false;
  }

  onHospitalChange(event: any): void {
    const selectedHospitalId = event.target.value;
    // console.log('Selected Hospital ID:', selectedHospitalId);
  }

  onTabClick(event: any) {
    this.selectedTabIndex = event.itemIndex;

    // Delay rendering for Data Grid
    setTimeout(() => {
      this.selectedTabIndex = event.itemIndex;
    }, 50);
  }

  onSave() {
    // console.log('Form is submitted');
    const payload = {
      USER_ID: this.userId,
      COLLECTION_ID: this.reportData.COLLECTION_ID,
      ReportWetFilm: this.reportData.ReportWetFilm,
      ReportGramStain: this.reportData.ReportGramStain,
      ZIEHEL_STAIN: this.reportData.ZIEHEL_STAIN,
      SPECIAL_STAIN: this.reportData.SPECIAL_STAIN,
      CULTURE: this.reportData.CULTURE,
      REMARKS: this.reportData.REMARKS,

      ISOLATE1_IDENTIFICATION: this.reportData.ISOLATE1_IDENTIFICATION,
      ISOLATE2_IDENTIFICATION: this.reportData.ISOLATE2_IDENTIFICATION,
      ISOLATE3_IDENTIFICATION: this.reportData.ISOLATE3_IDENTIFICATION,
      ReportEntry: this.reportData.ReportEntry,
      ISOLATE1_GROWTH_RATE: this.reportData.ISOLATE1_GROWTH_RATE,
      ISOLATE1_COLONY_COUNT: this.reportData.ISOLATE1_COLONY_COUNT,
      ISOLATE2_GROWTH_RATE: this.reportData.ISOLATE2_GROWTH_RATE,
      ISOLATE3_GROWTH_RATE: this.reportData.ISOLATE3_GROWTH_RATE,
      ISOLATE2_COLONY_COUNT: this.reportData.ISOLATE2_COLONY_COUNT,
      ISOLATE3_COLONY_COUNT: this.reportData.ISOLATE3_COLONY_COUNT,
      IS_PRELIMINERY: this.reportData.IS_PRELIMINERY,
      IS_PUBLISHED: this.reportData.IS_PUBLISHED,
    };
    this.myService.insertReportData(payload).subscribe((response: any) => {
      // console.log(response, 'SAVE RESPONSE');
      try {
        if (response) {
          notify(
            {
              message: 'Report added successfully',
              position: { at: 'top right', my: 'top right' },
            },
            'success'
          );
        }
      } catch (error) {
        // notify(
        //   {
        //     message: 'Add operation failed',
        //     position: { at: 'top right', my: 'top right' },
        //   },
        //   'error'
        // );
      }
    });
  }

  onEnterKey(e: any) {
    const grid = e.component;
    const { rowIndex, column } = e; // Extract rowIndex and column
    const columns = grid.getVisibleColumns();
    const columnIndex = columns.findIndex((col: any) => col.dataField === column.dataField);
  
    let nextColumnIndex = columnIndex + 1; // Move to next column
    let nextRowIndex = rowIndex;
  
    // Loop to find the next editable column
    while (nextColumnIndex < columns.length && columns[nextColumnIndex].allowEditing === false) {
      nextColumnIndex++;
    }
  
    // If it's the last column, move to the next row and first editable column
    if (nextColumnIndex >= columns.length) {
      nextColumnIndex = columns.findIndex((col: any) => col.allowEditing !== false); // Find first editable column
      nextRowIndex++;
    }
  
    // Check if the next row exists before editing
    if (nextRowIndex < grid.getDataSource().items().length) {
      grid.editCell(nextRowIndex, columns[nextColumnIndex].dataField);
    }
  }
  

  onEditorPreparing(e: any) {
    if (e.parentType === 'dataRow' && e.dataField === 'item') {
      e.editorOptions.stylingMode = 'filled';
    }

      // Handle Enter key navigation for all editable columns
  if (e.parentType === 'dataRow' && e.editorElement) {
    setTimeout(() => {
      e.editorElement.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default Enter behavior
          this.moveToNextCell(e);
        }
      });
    });
  }
  }

  moveToNextCell(e: any) {
    const grid = e.component;
    const rowIndex = e.row.rowIndex;
    const columnIndex = grid.columnOption(e.name, 'visibleIndex');
    const columns = grid.getVisibleColumns();
  
    let nextColumnIndex = columnIndex + 1;
    let nextRowIndex = rowIndex;
  
    // Find the next editable column
    while (nextColumnIndex < columns.length && !columns[nextColumnIndex].allowEditing) {
      nextColumnIndex++;
    }
  
    // Move to the next row if needed
    if (nextColumnIndex >= columns.length) {
      nextColumnIndex = columns.findIndex((col: any) => col.allowEditing !== false);
      nextRowIndex++;
    }
  
    // Ensure we don’t exceed available rows
    if (nextRowIndex < grid.getDataSource().items().length) {
      grid.editCell(nextRowIndex, columns[nextColumnIndex].dataField);
    }
  }

  openPopup() {
    // console.log('BUTTON CLICKED');
    this.selectedRowKeys = null;
    this.isPopupVisible = true;
  }
  onSelectionChanged(event: any) {
    this.selectedRowKeys = event.selectedRowKeys;
    this.selectedCollectionNo = event.selectedRowsData;
    // console.log('Selected Row Keys:', this.selectedRowKeys);
    // console.log('Selected Row Keys length:', this.selectedRowKeys.length);
    // console.log('Selected Organization Details:', this.selectedCollectionNo);
  }
}
function notify(
  arg0: { message: string; position: { at: string; my: string } },
  arg1: string
) {
  throw new Error('Function not implemented.');
}
