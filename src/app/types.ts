export type Advocate = {
  id: number; // Note: 'id' is only available with db turned on - this project assumes an active database moving forward
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};
