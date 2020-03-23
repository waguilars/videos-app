import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IIdentity } from '../../interfaces/identity';
import { Video } from '../../models/Video';
import { NgForm } from '@angular/forms';
import { VideoService } from '../../services/video.service';

@Component({
    selector: 'app-video-new',
    templateUrl: './video-new.component.html',
    styleUrls: ['./video-new.component.css']
})
export class VideoNewComponent implements OnInit {
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
        this.titlePage = 'Guardar nuevo video favorito';
        this.identity = this._user.getIdentity();
        this.token = this._user.getToken();

    }

    ngOnInit(): void {
        this.video = new Video(this.identity.sub);
    }

    onSubmit(form: NgForm) {
        this._video.create(this.token, this.video).subscribe(
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
