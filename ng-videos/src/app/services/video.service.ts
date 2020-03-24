import { Injectable } from '@angular/core';
import { config } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video } from '../models/Video';

@Injectable({
    providedIn: 'root'
})
export class VideoService {
    public url: string;

    constructor(public _htpp: HttpClient) {
        this.url = config.url;
    }

    create(token: string, video: Video): Observable<any> {
        const json = JSON.stringify(video);
        console.log(json);

        const params = 'json=' + json;

        const headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', token);
        return this._htpp.post(this.url + 'video/new', params, { headers });
    }

    getVideos(token: string, page: number = 1): Observable<any> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', token);
        return this._htpp.get(this.url + 'video/list?page=' + page, { headers });
    }

    getVideo(token: string, id: number): Observable<any> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', token);
        return this._htpp.get(this.url + 'video/detail/' + id, { headers });
    }

    update(token: string, video: Video): Observable<any> {
        const json = JSON.stringify(video);
        const params = 'json=' + json;

        const headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', token);
        return this._htpp.put(this.url + 'video/update/' + video.id, params, { headers });
    }

    delete(token: string, id: number): Observable<any> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', token);
        return this._htpp.delete(this.url + 'video/delete/' + id, { headers });
    }
}
