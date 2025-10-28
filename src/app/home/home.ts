import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule,FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IpoService } from '../services/ipo.service';
import { IPOINTERFACE } from '../Interfaces/ipoInterface';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule,FormsModule,JsonPipe,CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  ipoForm: FormGroup;
  ipoList : IPOINTERFACE[] = [];

  constructor(private fb:FormBuilder, private ipoService : IpoService, private cdf : ChangeDetectorRef){
    this.ipoForm = this.fb.group({
      ipoName : ["",Validators.required],
      panNumber : ["",Validators.required]
    })
  }

  ngOnInit(){

    this.ipoService.getAvailableIpos().subscribe({
      next : (ipoList : IPOINTERFACE [])=>{
        this.ipoList = ipoList;
        this.cdf.detectChanges();
        console.log(this.ipoList)
      },
      error : (err)=>{
        console.log(err)
      },
      complete : () => {}
    });
    
  }

  getAllotmentDetails(){

  }
}
