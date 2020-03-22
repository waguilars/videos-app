import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from './config.service';
import { User } from '../models/User';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public apiUrl: string;

    constructor(public _http: HttpClient) {
        this.apiUrl = config.url;
    }

    register(user: User): Observable<any> {
        const json = JSON.stringify(user);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.apiUrl + 'register', params, { headers });
    }
}
