export class Sticky {
    constructor(
        public title: string,
        public message?: string,
        public from?: string,
        public reserved?: boolean,
        public reservedBy?: string,
        public reservedDate?: string,
        public redeemed?: boolean,
        public redeemedDate?: string,
        public user?: string,
        public _id?: string
    ) {

    }
}
