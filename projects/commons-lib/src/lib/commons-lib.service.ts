import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, finalize, map, of } from 'rxjs';
import { Hero, HeroWithAgeGroup } from './interfaces/hero.interface';

@Injectable({
  providedIn: 'root'
})
export class CommonsLibService {

  private _heros = [
    { id: 1, name: 'Spider-Man', age: 25 },
    { id: 2, name: 'Iron Man', age: 40 },
    { id: 3, name: 'Wonder Woman', age: 30 },
    { id: 4, name: 'Superman', age: 35 }
  ];

  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  private mapHeroToHeroWithAgeGroup(hero: Hero): HeroWithAgeGroup {
    return {
      ...hero,
      ageGroup: hero.age < 30 ? 'Adolescente' : 'Adulto'
    };
  }

  getHeroes(): Observable<HeroWithAgeGroup[]> {
    this._loading.next(true);
    return of(this._heros).pipe(
      delay(1000),
      map(heroes => heroes.map(hero => this.mapHeroToHeroWithAgeGroup(hero))),
      finalize(() => {
        this._loading.next(false);
      })
    );
  }


  addHero(hero: Hero): Observable<HeroWithAgeGroup[]> {
    // Simulamos agregar un héroe a la lista y devolvemos la lista actualizada
    this._heros.push(hero);
    return of([this.mapHeroToHeroWithAgeGroup(hero)]);
  }

  updateHero(updatedHero: HeroWithAgeGroup): Observable<HeroWithAgeGroup[]> {
    // Simulamos actualizar un héroe en la lista y devolvemos la lista actualizada
    let index = this._heros.findIndex(hero => hero.id === updatedHero.id);
    if (index !== -1) {
      this._heros[index] = updatedHero;
    }
    return of(this._heros.map(hero => this.mapHeroToHeroWithAgeGroup(hero)));
  }


  deleteHero(heroId: number): Observable<HeroWithAgeGroup[]> {
    // Simulamos eliminar un héroe de la lista y devolvemos la lista actualizada
    this._heros = this._heros.filter(hero => hero.id !== heroId);
    return of(this._heros.map(hero => this.mapHeroToHeroWithAgeGroup(hero)));
  }

}
