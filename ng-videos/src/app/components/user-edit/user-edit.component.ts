import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { NgForm } from '@angular/forms';
import { IIdentity } from '../../interfaces/identity';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
    public titlePage: string;
    public user: User;
    public status: string;
    public identity: IIdentity;
    public token: string;

    constructor(private _user: UserService) {
        this.identity = this._user.getIdentity();
        this.token = this._user.getToken();
        this.titlePage = 'Ajustes de usuario';
        this.user = new User();
        this.user.name = this.identity.name;
        this.user.lastname = this.identity.lastname;
        this.user.email = this.identity.email;
    }

    ngOnInit(): void {
    }

    onSubmit(form: NgForm) {
        this._user.update(this.user, this.token).subscribe(
            res => {
                if (res.status === 'ok') {
                    this.status = 'ok';
                    this.identity.name = res.user.name;
                    this.identity.lastname = res.user.lastname;
                    this.identity.email = res.user.email;
                    this.user = res.user;
                    localStorage.setItem('identity', JSON.stringify(this.identity));

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
