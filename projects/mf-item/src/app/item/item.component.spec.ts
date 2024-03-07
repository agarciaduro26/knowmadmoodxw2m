import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemComponent } from './item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonsLibService, HeroWithAgeGroup } from '@commons-lib';
import { of, throwError } from 'rxjs';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  let mockCommonsLibService: any;
  let mockRouter: any;
  let mockSnackBar: any;

  beforeEach(async () => {
    mockCommonsLibService = jasmine.createSpyObj('CommonsLibService', ['getHeroes', 'addHero', 'updateHero']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatDividerModule
      ],
      providers: [
        { provide: CommonsLibService, useValue: mockCommonsLibService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize heroForm and fetch heroes on ngOnInit', () => {
    const heroes: HeroWithAgeGroup[] = [{ id: 1, name: 'Hero 1', age: 25, ageGroup: 'Adulto' }];
    mockCommonsLibService.getHeroes.and.returnValue(of(heroes));

    component.ngOnInit();

    expect(component.heroForm).toBeTruthy();
    expect(mockCommonsLibService.getHeroes).toHaveBeenCalled();
    expect(component.heros).toEqual(heroes);
  });

  it('should handle error when fetching heroes on ngOnInit', () => {
    mockCommonsLibService.getHeroes.and.returnValue(throwError('Error fetching heroes'));

    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching heroes:', 'Error fetching heroes');
  });

  it('should add new hero', () => {
    const newHero: HeroWithAgeGroup = { id: 2, name: 'Hero 2', age: 30, ageGroup: 'Adulto' };
    const heroes: HeroWithAgeGroup[] = [{ id: 1, name: 'Hero 1', age: 25, ageGroup: 'Adulto' }];
    mockCommonsLibService.getHeroes.and.returnValue(of(heroes));
    mockCommonsLibService.addHero.and.returnValue(of([newHero]));

    component.ngOnInit();
    component.heroForm.patchValue({ name: 'Hero 2', age: 30 });
    component.addNew();

    expect(mockCommonsLibService.addHero).toHaveBeenCalledWith({ id: 2, name: 'Hero 2', age: 30 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Héroe creado', 'Cerrar', jasmine.any(Object));
  });

  it('should handle error when adding new hero', () => {
    const heroes: HeroWithAgeGroup[] = [{ id: 1, name: 'Hero 1', age: 25, ageGroup: 'Adulto' }];
    mockCommonsLibService.getHeroes.and.returnValue(of(heroes));
    mockCommonsLibService.addHero.and.returnValue(throwError('Error adding new hero'));

    spyOn(console, 'error');

    component.ngOnInit();
    component.heroForm.patchValue({ name: 'Hero 2', age: 30 });
    component.addNew();

    expect(console.error).toHaveBeenCalledWith('Error al agregar el héroe:', 'Error adding new hero');
  });

  it('should edit hero', () => {
    const editedHero: HeroWithAgeGroup = { id: 1, name: 'Hero 1 Edited', age: 30, ageGroup: 'Adulto' };
    const heroes: HeroWithAgeGroup[] = [{ id: 1, name: 'Hero 1', age: 25, ageGroup: 'Adulto' }];
    component.hero = { ...heroes[0] };
    mockCommonsLibService.getHeroes.and.returnValue(of(heroes));
    mockCommonsLibService.updateHero.and.returnValue(of([editedHero]));

    component.ngOnInit();
    component.heroForm.patchValue({ name: 'Hero 1 Edited', age: 30 });
    component.edit();

    expect(mockCommonsLibService.updateHero).toHaveBeenCalledWith(editedHero);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Héroe modificado', 'Cerrar', jasmine.any(Object));
  });

  it('should handle error when editing hero', () => {
    const heroes: HeroWithAgeGroup[] = [{ id: 1, name: 'Hero 1', age: 25, ageGroup: 'Adulto' }];
    component.hero = { ...heroes[0] };
    mockCommonsLibService.getHeroes.and.returnValue(of(heroes));
    mockCommonsLibService.updateHero.and.returnValue(throwError('Error editing hero'));

    spyOn(console, 'error');

    component.ngOnInit();
    component.heroForm.patchValue({ name: 'Hero 1 Edited', age: 30 });
    component.edit();

    expect(console.error).toHaveBeenCalledWith('Error al modificar el héroe:', 'Error editing hero');
  });
});
