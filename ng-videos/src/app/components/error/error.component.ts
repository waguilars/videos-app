import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
    public titlePage: string;

    constructor() {
        this.titlePage = 'Error 404';
    }

    ngOnInit(): void {
    }

}
