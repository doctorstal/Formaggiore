export interface Recipe {
    name: string;
    description: string;
    steps?: Step[];
}
interface Step {
    // TODO
}
export interface Session {
    userId: string;
}

export class User {
    constructor(public name?: string,
                public email?: string) {
    }
}

export type Credentials = { login: string; password: string; email?: string; name?: string; };
