import { Component, OnInit, inject } from '@angular/core';
import { CommonsLibService} from '@commons-lib';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})


export class ListComponent implements OnInit {
  heros: any[] = [];
  filteredHeros: any[] = []; // Nueva propiedad para almacenar los héroes filtrados
  private readonly _commonsLibService = inject(CommonsLibService);
  private readonly _snackBar = inject(MatSnackBar);
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this._commonsLibService.herosData$.subscribe({
      next: (data) => {
        this.heros = data;
        this.filteredHeros = data; // Inicializa filteredHeros con todos los héroes
      }
    });
  }

  deleteHero(hero: any){
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {};
    dialogConfig.data.title = 'Eliminar héroe';
    dialogConfig.data.content = "<p>Estás a punto de eliminar este héroe</p><p>¿Quieres continuar?</p>";
    let dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((response) => {
      if(response.success){
        this.heros = this.heros.filter(h => h !== hero);
        this.filteredHeros = this.filteredHeros.filter(h => h !== hero); // Actualiza filteredHeros
        this._commonsLibService.sendData(this.heros);
        this._snackBar.open('Héroe eliminado', 'Cerrar', {
          duration: 7000, // Duración de la notificación en milisegundos
          verticalPosition: 'top' // Posición vertical de la notificación
        });
      }
    });
  }

  filterHeros(event: any) {
    let searchTerm = event.target.value.toLowerCase();
    if (searchTerm === '') {
      this.filteredHeros = this.heros;
    } else {
      this.filteredHeros = this.heros.filter(hero =>
        hero.name.toLowerCase().includes(searchTerm)
      );
    }
  }
}
