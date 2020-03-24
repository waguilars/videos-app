import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';
import { Video } from '../../models/Video';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public titlePage: string;
    public identity: object;
    public token: string;
    public videos: Array<Video>;
    public actualPage: number;
    public prevPage: number;
    public nextPage: number;
    public totalPages: number;
    public pages: Array<number>;

    constructor(
        private _user: UserService,
        private _video: VideoService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this.titlePage = 'Inicio';
        this.identity = this._user.getIdentity();
        this.token = _user.getToken();

    }

    ngOnInit(): void {
        this._route.params.subscribe(params => {
            let page = params.page;
            if (!page || page < 1) {
                page = 1;
            }
            this.getVideos(page);
        });
    }

    getVideos(page: number) {
        this._video.getVideos(this.token, page).subscribe(
            res => {
                this.videos = res.videos;
                this.actualPage = res.page;
                this.nextPage = this.actualPage + 1;
                this.prevPage = this.actualPage - 1;
                this.totalPages = res.totalPages;
                this.pages = [];
                for (let i = 1; i <= this.totalPages; i++) {
                    this.pages.push(i);
                }


            },
            err => {
                console.log(err);

            }
        );
    }

    getThumb(url: string, size: string = null) {
        let video: string;
        let results: any[];
        let thumburl: string;

        if (url === null) {
            return '';
        }

        results = url.match('[\\?&]v=([^&#]*)');
        video = (results === null) ? url : results[1];

        if (size != null) {
            thumburl = 'http://img.youtube.com/vi/' + video + '/' + size + '.jpg';
        } else {
            thumburl = 'http://img.youtube.com/vi/' + video + '/mqdefault.jpg';
        }

        return thumburl;

    }

    deleteVideo(id: number) {
        this._video.delete(this.token, id).subscribe(
            res => {
                this.getVideos(this.actualPage);
            },
            err => {
                console.log(err);

            }
        );
    }


}
