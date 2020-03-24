import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IIdentity } from '../../interfaces/identity';
import { Video } from '../../models/Video';
import { VideoService } from '../../services/video.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
    selector: 'app-video-detail',
    templateUrl: './video-detail.component.html',
    styleUrls: ['./video-detail.component.css']
})
export class VideoDetailComponent implements OnInit {

    public identity: IIdentity;
    public token: string;
    public video: Video;
    public status: string;

    constructor(
        private _route: ActivatedRoute,
        private _sanitizer: DomSanitizer,
        private _user: UserService,
        private _video: VideoService
    ) {

        this.identity = this._user.getIdentity();
        this.token = this._user.getToken();

    }

    ngOnInit(): void {

        this.getVideo();
    }
    getVideo() {
        this._route.params.subscribe(params => {
            const videoId = params.id;

            this._video.getVideo(this.token, videoId).subscribe(
                res => {
                    this.video = res.video;
                    console.log(res);

                },
                err => {
                    console.log(err);
                }
            );
        });
    }

    getVideoIframe(url: string) {
        let video: string;
        let results: any[];

        if (url === null) {
            return '';
        }
        results = url.match('[\\?&]v=([^&#]*)');
        video = (results === null) ? url : results[1];

        return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
    }


}
