import { Component, Input, inject } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonsLibService, Hero, HeroWithAgeGroup } from '@commons-lib';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule, MatDividerModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {

  @Input() id!: string;
  heroForm!: FormGroup;
  hero!: HeroWithAgeGroup;
  heros!: HeroWithAgeGroup[];

  private readonly _commonsLibService = inject(CommonsLibService);
  private readonly _route = inject(Router);
  private readonly _snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.heroForm = new FormGroup({
      name: new FormControl(''),
      age: new FormControl('')
    });

    this._commonsLibService.getHeroes().pipe(
      tap(data => {
        this.heros = data;
        if (this.id) {
          let hero = this.heros.find(h => h.id === parseInt(this.id));
          if (hero) {
            this.hero = hero;
            this._setFormValues();
          }
        }
      }),
      catchError(error => {
        console.error('Error fetching heroes:', error);
        return [];
      })
    ).subscribe();
  }

  private _setFormValues(): void {
    if (this.hero) {
      this.heroForm.patchValue({
        name: this.hero.name,
        age: this.hero.age
      });
    }
  }

  addNew() {
    let newId = Math.max(...this.heros.map(h => h.id)) + 1;
    let newHero = { 'id': newId, ...this.heroForm.value };
    this._commonsLibService.addHero(newHero).subscribe({
      next: () => {
        this._route.navigate(['/']);
        this._snackBar.open('Héroe creado', 'Cerrar', {
          duration: 7000,
          verticalPosition: 'top'
        });
      },
      error: (error: any) => {
        console.error("Error al agregar el héroe:", error);
      }
    });
  }

  edit() {
    this.hero = { ...this.hero, ...this.heroForm.value };
    this._commonsLibService.updateHero(this.hero).subscribe({
      next: () => {
        this._route.navigate(['/']);
        this._snackBar.open('Héroe modificado', 'Cerrar', {
          duration: 7000,
          verticalPosition: 'top'
        });
      },
      error: (error: any) => {
        console.error("Error al modificar el héroe:", error);
      }
    });
  }
}
