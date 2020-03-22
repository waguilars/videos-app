import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    public titlePage: string;
    public user: User;
    public status: string;
    public message: string;

    constructor(private _user: UserService) {
        this.titlePage = 'Registro';
        this.user = new User();

    }

    ngOnInit(): void {
    }

    onSubmit(form: NgForm) {
        this._user.register(this.user).subscribe(
            res => {
                if (res.status === 'ok') {
                    this.status = 'ok';
                    form.reset();
                } else {
                    this.status = 'error';
                }

                this.message = res.message;

            },
            err => {
                console.log(err);
                this.status = 'error';
                this.message = err.error.message;
            }
        );
    }

}
