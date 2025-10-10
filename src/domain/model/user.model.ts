import { Passions } from "./passions.model";

export interface User{
    uid: string;
    name: string;
    lastName: string;
    email: string;
    birthDate: string;
    country: string;
    gender: string;
    showGenderProfile: boolean;
    passions: Passions[];
    photos: string[];
}