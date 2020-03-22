import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
    public title = 'ng-videos';
    public identity: any;
    public token: string;

    constructor(private _user: UserService) {

    }
    ngDoCheck(): void {
        this.identity = this._user.getIdentity();


    }
    ngOnInit(): void {
        // this.loadUser();

    }


}
