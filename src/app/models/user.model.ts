export class User {
    constructor(
        public username: string,
        public email: string,
        public password: string,
        public name: string,
        public url: string,
        public address: string,
        public city: string,
        public state: string,
        public zipcode: string,
        public phone: string
    ) {}
}
