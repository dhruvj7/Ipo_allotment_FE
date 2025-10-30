import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule,FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IpoService } from '../services/ipo.service';
import { IPOINTERFACE } from '../Interfaces/ipoInterface';
import { ChangeDetectorRef } from '@angular/core';
import { ALLOTMENTREQUEST } from '../Interfaces/allotmentRequest';
import { ALLOTMENTRESULT } from '../Interfaces/allotmentResult';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  ipoForm: FormGroup;
  ipoList : IPOINTERFACE[] = [];
  selectedIpo : any;
  resultDisplay : Boolean = false;


  allotmentResult:ALLOTMENTRESULT = {
    message : "",
    panNumber : "",
    applicantName : "",
    numberOfSharesAlloted : "",
    numberOfSharesApplied : "",
    allotted : false
  };

  constructor(private fb:FormBuilder, private ipoService : IpoService, private cdr : ChangeDetectorRef){
    this.ipoForm = this.fb.group({
      ipoName : ["",Validators.required],
      panNumber : ["",Validators.required]
    })
  }

  ngOnInit(){
    this.ipoService.getAvailableIpos().subscribe({
      next : (ipoList : IPOINTERFACE [])=>{
        this.ipoList = ipoList;
        this.cdr.detectChanges();
      },
      error : (err)=>{
        console.log(err)
      },
      complete : () => {}
    });
    
  }

  getAllotmentDetails() {
    const selectedCompanyId = this.ipoForm.value.ipoName;
    const panNumber = this.ipoForm.value.panNumber;

    this.selectedIpo = this.ipoList.find(
      (ipo) => ipo.companyId === selectedCompanyId
    );

    if (!this.selectedIpo) {
      console.warn('No IPO found for selected companyId');
      return;
    }

    const payload: ALLOTMENTREQUEST = {
      clientid: this.selectedIpo.companyId,
      PAN: panNumber,
      IFSC: "",
      CHKVAL: "1",
      token: "" // Replace with UUID or your token logic
    };


    this.ipoService.getAllotmentDetails(payload,this.selectedIpo.registrarId).subscribe({
      next : (res)=>{
        this.allotmentResult=res;
        this.resultDisplay = true;
        this.cdr.detectChanges();
      },
      error : (err)=>{}
    })
  }

  back(){
    this.resultDisplay= false;
    this.cdr.detectChanges();
  }
}
