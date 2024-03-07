import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonsLibService, HeroWithAgeGroup} from '@commons-lib';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})


export class ListComponent implements OnInit {

  public loading$!: Observable<boolean>;
  public readonly heros = signal<HeroWithAgeGroup[]>([]);
  public filteredHeros = signal<HeroWithAgeGroup[]>([]);

  private readonly _commonsLibService = inject(CommonsLibService);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loading$ = this._commonsLibService.loading$;

    this._commonsLibService.getHeroes().pipe(
      tap( heros => {
        this.heros.set( heros);
        this.filteredHeros.set( heros );
      }),
      catchError(error => {
        console.error('Error fetching heroes:', error);
        return of([]);
      })
    ).subscribe();
  }

  deleteHero(hero: HeroWithAgeGroup): void {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {};
    dialogConfig.data.title = 'Eliminar héroe';
    dialogConfig.data.content = "<p>Estás a punto de eliminar este héroe</p><p>¿Quieres continuar?</p>";
    let dialogRef = this._dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((response) => {
      if (response.success) {
        this._commonsLibService.deleteHero(hero.id).pipe(
          tap(updatedHeros => {
            this.heros.set( updatedHeros );
            this.filteredHeros.set( updatedHeros );
          })
        ).subscribe({
          next: () => {
            this._snackBar.open('Héroe eliminado', 'Cerrar', {
              duration: 7000,
              verticalPosition: 'top'
            });
          },
          error: (error: any) => {
            console.error("Error al eliminar el héroe:", error);
          }
        });
      }
    });
  }


  filterHeros(event: any) {
    let searchTerm = event.target.value.toLowerCase();
    if (searchTerm === '') {
      this.filteredHeros.set(this.heros());
    } else {
      this.filteredHeros.set( this.heros().filter(hero =>
        hero.name.toLowerCase().includes(searchTerm))
      )};
  }
}
