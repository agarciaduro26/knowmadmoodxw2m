import { Component, Input, inject } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonsLibService } from '@commons-lib';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

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
  hero: any;
  heros!: any[];
  private readonly _commonsLibService = inject(CommonsLibService);
  private readonly _route = inject(Router);
  private readonly _snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.heroForm = new FormGroup({
      name: new FormControl(''),
      age: new FormControl('')
    });

    this._commonsLibService.herosData$.subscribe({
      next: (data) => {
        this.heros = data;
        if(this.id){
          this.hero = data.find(h => h.id === parseInt(this.id));
          this.setFormValues();
        }
      }
    });
  }

  private setFormValues(): void {
    if (this.hero) {
      this.heroForm.patchValue({
        name: this.hero.name,
        age: this.hero.age
      });
    }
  }

  addNew(){
    let newId = Math.max(...this.heros.map(h => h.id)) + 1;
    let newHero = { 'id': newId, ...this.heroForm.value };
    this.heros.push(newHero);
    this._commonsLibService.sendData(this.heros);
    this._route.navigate(['/']);
    this._snackBar.open('Héroe creado', 'Cerrar', {
      duration: 7000, // Duración de la notificación en milisegundos
      verticalPosition: 'top' // Posición vertical de la notificación
    });
  }

  editar(){
    let index = this.heros.findIndex(h => h.id === this.hero.id);
    if (index !== -1) {
      this.heros[index] = { ...this.hero, ...this.heroForm.value };
      this._commonsLibService.sendData(this.heros);
      this._route.navigate(['/']);
      this._snackBar.open('Héroe modificado', 'Cerrar', {
        duration: 7000, // Duración de la notificación en milisegundos
        verticalPosition: 'top' // Posición vertical de la notificación
      });
    }
  }
}
