export interface ICandidate {
    _id?: string;
    uid: string;
    name: {
        first: string;
        last: string;
    };
    bio: string;
    avatar: string;
    gender: "male" | "female" | string;
    contact: {
        phone: string;
        email: string;
    };
    birth: {
        date: string;
        age: number;
    };
    skills: string[];
    education: {
        highest: string;
        institutions: {
            name: string;
            major: string;
            degree: string;
            start: string;
            end: string;
        }[];
    };
    experience: {
        current: {
            company: string;
            designation: string;
        };
        companies: {
            name: string;
            designation: string;
            start: string;
            end: string;
            isPresent: boolean;
            description: string;
        }[];
        total: number;
    };

}
