class DBFolderModel {
    constructor() {
        this.id = -1;
        this.time = "";
        this.user = "";
        this.Component = "";
        this.Version = "";
        this.Revision = "";
        this.actionName = "";
        this.name = "";
        this.size = 0;
        this.type = "";
        this.lastModified = "";
        this.isFolder = false;
        this.isActive = false;
        this.status = "";
        this.path = "";
        this.fileID = -1;
        this.url="";
    }

    toString() {
        return `id:${this.id}\n 
        time:${this.time}\n
        user:${this.user}\n
        component:${this.Component}\n
        version:${this.Version}\n
        revision:${this.Revision}\n
        diff:${this.actionName}\n
        `;
    }
}