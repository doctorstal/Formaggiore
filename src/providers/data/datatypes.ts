type BasicArticle = {
    id?: number;
    name: string;
    description: string;
};

export type Recipe = BasicArticle & {
    steps?: Step[];
};

export type RecipeDetails = BasicArticle & {
    steps?: StepDetails[];
};

export type Step = BasicArticle & {
    step_number?: number;
};

export enum MediaType{
    PHOTO,
    VIDEO
}
export type Media = { id?: number, type: MediaType, content: string };

export type StepDetails = Step & {
    media?: Media[],
    knowledge?: Knowledge,
    directive?: SensorDirective
};

export type Knowledge = BasicArticle;

export type SensorDirective = {
    sTypeName?: string,
    sTypeToken: string,
    startValue: number,
    endValue: number,
    time: number
}


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

