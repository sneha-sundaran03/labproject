import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
// import { environment } from 'src/app/environments/environment';
import { environment } from './environments/environment';
@Injectable({
  providedIn: 'root',
})

export class MyserviceService {
  private isAuthenticatedFlag: boolean = false;
  private BASE_URL = environment.LIS_API_BASE_URL;
  userId: any;
  loggedInUser: any;
  
  constructor(private http:HttpClient) {
 
    
   }

  getUserId() {
    this.userId = sessionStorage.getItem('userId');
    // console.log(this.userId,"USERID")
    return this.userId;
  }

  isAuthenticated(): boolean {
    // Check if sessionStorage contains a valid userId
    const userId = sessionStorage.getItem('userId');
    // console.log(userId,"USERID==")
    return userId !== null && userId !== undefined;
  }

  // private apiUrl="http://labapi.microgmck.in/api/";

  login(payload: { LOGIN_NAME: string; PASSWORD: string }) {
    const endPoint = `${this.BASE_URL}userlab/login`;
    return this.http.post(endPoint, payload);
  }
  
  setAuthenticationStatus(status: boolean): void {
    this.isAuthenticatedFlag = status;
  }

  getCollectionList(payload:any) {
    const getEndpoint = `${this.BASE_URL}collection/collectionlist`;
    return this.http.post(getEndpoint, payload);
  }
  
  insertCollectionData(data:any) {
    const url = `${this.BASE_URL}collection/insert`;
      return this.http.post(url,data);  
    };

  getMastersList() {
    const getEndpoint =`${this.BASE_URL}collection/masterlist`;
    return this.http.post(getEndpoint,{});
  }

  getCollectionNo(){
    const endPoint = `${this.BASE_URL}collection/CollectionNo`
    return this.http.post(endPoint,{})
  }

  getMicroscopyData(){
    const endPoint = `${this.BASE_URL}report/initData`
    return this.http.post(endPoint,{})
  }

  getPendingCollectionData(){
    const endPoint = `${this.BASE_URL}collection/pendingCollection`
    return this.http.post(endPoint,{})
  }


  // REPORT
  insertReportData(data:any) {
    const url = `${this.BASE_URL}report/insert`;
      return this.http.post(url,data);  
    };

}
