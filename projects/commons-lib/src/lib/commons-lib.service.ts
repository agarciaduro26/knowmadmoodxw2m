import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Hero } from './interfaces/hero.interface';

@Injectable({
  providedIn: 'root'
})
export class CommonsLibService {

  private _heros: Hero[] = [
    {
      id: 1,
      name: 'Spider-Man',
      age: 25
    },
    {
      id: 2,
      name: 'Iron Man',
      age: 40
    },
    {
      id: 3,
      name: 'Wonder Woman',
      age: 30
    },
    {
      id: 4,
      name: 'Superman',
      age: 35
    }
  ];

  private _channelSource = new BehaviorSubject<Hero[]>(this._heros);
  herosData$: Observable<Hero[]> = this._channelSource.asObservable();

  sendData(data: any): void {
    this._channelSource.next(data);
  }
}
