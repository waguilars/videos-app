import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IIdentity } from '../../interfaces/identity';
import { Video } from '../../models/Video';
import { NgForm } from '@angular/forms';
import { VideoService } from '../../services/video.service';

@Component({
    selector: 'app-video-edit',
    templateUrl: '../video-new/video-new.component.html',
    styleUrls: ['./video-edit.component.css']
})
export class VideoEditComponent implements OnInit {
    public titlePage: string;
    public identity: IIdentity;
    public token: string;
    public video: Video;
    public status: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _user: UserService,
        private _video: VideoService
    ) {
        this.titlePage = 'Editar Video';
        this.identity = this._user.getIdentity();
        this.token = this._user.getToken();
    }

    ngOnInit(): void {
        this.video = new Video(this.identity.sub);
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

    onSubmit(form: NgForm) {
        this._video.update(this.token, this.video).subscribe(
            res => {
                if (res.status === 'ok') {
                    this.status = 'ok';
                    this._router.navigate(['/inicio']);
                } else {
                    this.status = 'error';
                }
            },

            err => {
                console.log(err);
                this.status = 'error';
            }
        );

    }

}
