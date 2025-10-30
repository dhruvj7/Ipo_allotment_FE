import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { IPOINTERFACE } from '../Interfaces/ipoInterface';
import { ALLOTMENTREQUEST } from '../Interfaces/allotmentRequest';
import { ALLOTMENTRESULT } from '../Interfaces/allotmentResult';

@Injectable({
  providedIn: 'root',
})

export class IpoService {
  constructor(private http : HttpClient){}

  getAvailableIpos(){
    return this.http.get<IPOINTERFACE []> (environment.BASE_URL + "/ipos");
  }

  getAllotmentDetails(allotmentPayload : ALLOTMENTREQUEST, registrarId: Number){
    return this.http.post<ALLOTMENTRESULT>(environment.BASE_URL+`/ipo/checkAllotment/${registrarId}`, allotmentPayload);
  }

}
