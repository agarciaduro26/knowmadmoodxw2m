export interface Hero {
  id: number;
  name: string;
  age: number;
}

export interface HeroWithAgeGroup extends Hero {
  ageGroup: 'Adolescente' | 'Adulto';
}
