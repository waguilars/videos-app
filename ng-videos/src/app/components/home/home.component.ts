import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public titlePage: string;
    public identity: object;
    public token: string;

    constructor(private _user: UserService) {
        this.titlePage = 'Inicio';
        this.identity = this._user.getIdentity();
        this.token = _user.getToken();
    }

    ngOnInit(): void {
    }

}
