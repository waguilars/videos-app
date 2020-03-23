import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-video-new',
    templateUrl: './video-new.component.html',
    styleUrls: ['./video-new.component.css']
})
export class VideoNewComponent implements OnInit {
    public titlePage: string;

    constructor() {
        this.titlePage = 'Guardar nuevo video favorito';
    }

    ngOnInit(): void {
    }

}
