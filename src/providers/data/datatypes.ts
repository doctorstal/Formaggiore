type BasicArticle = {
    id: number;
    name: string;
    description: string;
};

export type Recipe = BasicArticle & {
    steps?: Step[];
};

export type Step = BasicArticle;

export type Knowledge = BasicArticle;


export enum Role {
    MANAGER,
    EMPLOYEE,
    INTERN
}

export type Session = {
    userId: string;
}

export type UserData = {
    name?: string;
    email?: string;
};

export type Credentials = UserData & {
    login: string;
    password: string;
};

export type User = UserData & {
    id?: number;
};

export type UserWithRole = User & {
    role: Role;

};

export type UserDetails = UserWithRole & {
    login: string;
    completedRecipes: Recipe[];
    composedRecipes: Recipe[];
};

