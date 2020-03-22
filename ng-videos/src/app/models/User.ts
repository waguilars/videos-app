export class User {
    public id: number;
    public name: string;
    public lastname: string;
    public email: string;
    public password: string;
    public role: string;
    public createdAt: Date;
    public token: boolean;

    constructor() {
        this.id = null;
        this.name = '';
        this.lastname = '';
        this.email = '';
        this.password = '';
        this.role = 'ROLE_USER';
        this.createdAt = null;
        this.token = false;
    }
}
