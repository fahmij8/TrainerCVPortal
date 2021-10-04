import { User } from "@firebase/auth";

export interface StringKeyObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface NumberKeyObject {
    [key: number]: number;
}

export interface StringKeyNumberValueObject {
    [key: string]: number;
}

interface UserData {
    name: string;
    email: string;
    tel: string;
    nim: string;
    major: string;
    photo: string;
    module1_score: {
        step1: number;
        step2: number;
        step3: number;
        step4: number;
        bonus_score: number;
    };
    module2_score: {
        step1: number;
        step2: number;
        step3: number;
        step4: number;
        bonus_score: number;
    };
    module3_score: {
        step1: number;
        step2: number;
        step3: number;
        step4: number;
        bonus_score: number;
    };
    module4_score: {
        step1: number;
        step2: number;
        step3: number;
        step4: number;
        bonus_score: number;
    };
    module5_score: {
        step1: number;
        step2: number;
        step3: number;
        step4: number;
        bonus_score: number;
    };
}

export const userDataObjects = (data: User, formValues: [string, string, string, string]): UserData => {
    return {
        name: data.displayName,
        email: data.email,
        tel: `62${formValues[2]}`,
        nim: formValues[0],
        major: formValues[1],
        photo: formValues[3],
        module1_score: {
            step1: 0,
            step2: 0,
            step3: 0,
            step4: 0,
            bonus_score: 0,
        },
        module2_score: {
            step1: 0,
            step2: 0,
            step3: 0,
            step4: 0,
            bonus_score: 0,
        },
        module3_score: {
            step1: 0,
            step2: 0,
            step3: 0,
            step4: 0,
            bonus_score: 0,
        },
        module4_score: {
            step1: 0,
            step2: 0,
            step3: 0,
            step4: 0,
            bonus_score: 0,
        },
        module5_score: {
            step1: 0,
            step2: 0,
            step3: 0,
            step4: 0,
            bonus_score: 0,
        },
    };
};

export interface ScoresSummaryType {
    step1: number;
    step2: number;
    step3: number;
    step4: number;
    bonus_score: number;
}

export interface QueueDataType {
    [key: string]: { email: string; name: string; status: string };
}

export interface QueueDataValueType {
    email: string;
    name: string;
    status: string;
}
