import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public titlePage: string;
    public user: User;
    public identity: object;
    public token: string;
    public status: string;


    constructor(
        private _user: UserService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this.titlePage = 'Login';
        this.user = new User();

    }

    ngOnInit(): void {
        this.logout();
    }

    onSubmit(form: NgForm) {

        this._user.login(this.user).subscribe(
            res => {
                if (res.status === 'ok') {
                    this.status = 'ok';
                    this.identity = res.data;

                    this._user.login(this.user, true).subscribe(
                        res2 => {
                            if (res2.status === 'ok') {
                                this.status = 'ok';
                                this.token = res2.data;

                                // Persistir data de usuario logeado
                                localStorage.setItem('identity', JSON.stringify(this.identity));
                                localStorage.setItem('token', this.token);

                                // this._router.navigate(['/inicio']);
                            } else {
                                this.status = 'error';
                            }
                        },
                        err => {
                            console.log(err);
                            this.status = 'error';

                        });

                } else {
                    this.status = 'error';
                }
            },
            err => {
                console.log(err);
                this.status = 'error';

            });
    }

    logout() {
        this._route.params.subscribe(params => {
            const sure = +params.sure;

            if (sure === 1) {
                localStorage.removeItem('identity');
                localStorage.removeItem('token');

                this.identity = null;
                this.token = null;

                this._router.navigate(['/inicio']);
            }
        });
    }

}
