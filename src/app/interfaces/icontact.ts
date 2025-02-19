export interface IContact {
    name: string;
    eMail: string;
    phone: number | string;
    initials?: string;
    id?: string;
    isOpened?: boolean;
    styleSelector?: string;
}
