import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { RestaurentData } from '../restaurent-dash/restaurent.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5200/restaurants';

  constructor(private _http: HttpClient) { }

  // POST request
  postRestaurent(data: RestaurentData) {
    return this._http.post<RestaurentData>(this.baseUrl, data);
  }

  // GET request
  getRestaurent() {
    return this._http.get<RestaurentData[]>(this.baseUrl);
  }

  // DELETE request
  deleteRestaurant(id: string) {
    return this._http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // UPDATE request
  updateRestaurant(id: string, data: RestaurentData) {
    return this._http.put<RestaurentData>(`${this.baseUrl}/${id}`, data);
  }
}