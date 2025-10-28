import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { IPOINTERFACE } from '../Interfaces/ipoInterface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class IpoService {
  constructor(private http : HttpClient){}

  getAvailableIpos(){
    return this.http.get<IPOINTERFACE []> (environment.BASE_URL + "/ipos");
  }
}
