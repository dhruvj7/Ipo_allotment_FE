import { CommonModule, JsonPipe } from '@angular/common';
import { Component, signal, Signal } from '@angular/core';
import { ReactiveFormsModule,FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IpoService } from '../services/ipo.service';
import { IPOINTERFACE } from '../Interfaces/ipoInterface';
import { ChangeDetectorRef } from '@angular/core';
import { ALLOTMENTREQUEST } from '../Interfaces/allotmentRequest';
import { ALLOTMENTRESULT } from '../Interfaces/allotmentResult';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  ipoForm: FormGroup;
  ipoList = signal<IPOINTERFACE[]>([]);
  selectedIpo = signal<any>(null);
  resultDisplay = signal<boolean>(false) ;
  errorMessage = signal<Boolean>(false);
  showErrorPopup = signal<boolean>(false);
  errorMessageText = signal<string>("");
  isLoading = signal<boolean>(false);

  allotmentResult= signal<ALLOTMENTRESULT>({
    message : "",
    panNumber : "",
    applicantName : "",
    numberOfSharesAlloted : "",
    numberOfSharesApplied : "",
    allotted : false
  });

  constructor(private fb:FormBuilder, private ipoService : IpoService, private cdr : ChangeDetectorRef){
    this.ipoForm = this.fb.group({
      ipoName : ["",Validators.required],
      panNumber : ["",[Validators.required,Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]]
    })
  }

  ngOnInit(){
    this.isLoading.set(true)
    this.ipoService.getAvailableIpos().subscribe({
      next : (ipoList : IPOINTERFACE [])=>{
        const sortedList = ipoList.sort((a, b) => 
          a.companyName.localeCompare(b.companyName as string)
        );
        this.ipoList.set(sortedList);
        this.isLoading.set(false);
      },
      error : (err)=>{
        this.errorMessageText.set("Too many users at the moment, please try again later.");
        this.showErrorPopup.set(true);
        this.isLoading.set(false);
      },
      complete : () => {
      }
    });

    this.ipoForm.valueChanges.subscribe((data)=>{
      if(this.ipoForm.controls['panNumber'].invalid && this.ipoForm.controls['panNumber'].dirty){
        this.errorMessage.set(true);
      }else{
        this.errorMessage.set(false);
      }
    })

  }

  closeErrorPopup() {
    this.showErrorPopup.set(false);
  }

  getAllotmentDetails() {
    this.isLoading.set(true)

    const selectedCompanyId = this.ipoForm.value.ipoName;
    const panNumber = this.ipoForm.value.panNumber;

    this.selectedIpo.set(this.ipoList().find(
      (ipo) => ipo.companyId === selectedCompanyId
    ));

    if (!this.selectedIpo) {
      console.warn('No IPO found for selected companyId');
      return;
    }

    const payload: ALLOTMENTREQUEST = {
      clientid: this.selectedIpo().companyId,
      PAN: panNumber,
      IFSC: "",
      CHKVAL: "1",
      token: uuidv4()
    };


    this.ipoService.getAllotmentDetails(payload,this.selectedIpo().registrarId).subscribe({
      next : (res)=>{
        this.allotmentResult.set(res);
        if(res.numberOfSharesApplied == null){
          return this.handleError();
        }
        console.log("result-",res)
        this.resultDisplay.set(true);
        this.isLoading.set(false);
      },
      error : (err)=>{
        this.handleError();
      },
      complete :()=>{
      }
    })
  }

  handleError(){
    this.errorMessageText.set("Failed to fetch allotment details. Record not found or accessible at the moment.");
    this.showErrorPopup.set(true);
    this.isLoading.set(false);
  }

  back(){
    this.resultDisplay.set(false);
  }
}
