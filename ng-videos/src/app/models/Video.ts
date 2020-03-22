export class Video {
    public id: number;
    public userId: number;
    public title: string;
    public description: string;
    public url: string;
    public status: string;
    public createdAT: Date;
    public updatedAT: Date;
    constructor() {
        this.id = null;
        this.userId = null;
        this.title = '';
        this.description = '';
        this.url = '';
        this.status = '';
        this.createdAT = null;
        this.updatedAT = null;

    }
}