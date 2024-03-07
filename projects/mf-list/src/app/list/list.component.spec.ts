import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { CommonsLibService, HeroWithAgeGroup } from '@commons-lib';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockCommonsLibService: jasmine.SpyObj<CommonsLibService>;
  let mockSnackBar: any;
  let mockDialog: any;

  beforeEach(async () => {
    mockCommonsLibService = jasmine.createSpyObj('CommonsLibService', ['getHeroes', 'deleteHero']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ ListComponent ],
      providers: [
        { provide: CommonsLibService, useValue: mockCommonsLibService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    mockCommonsLibService = TestBed.inject(CommonsLibService) as jasmine.SpyObj<CommonsLibService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch heroes on initialization', () => {
    const heroes: HeroWithAgeGroup[] = [
      { id: 1, name: 'Hero 1', age: 25, ageGroup: 'Adulto' },
      { id: 2, name: 'Hero 2', age: 30, ageGroup: 'Adulto' }
    ];
    mockCommonsLibService.getHeroes.and.returnValue(of(heroes));

    component.ngOnInit();

    expect(component.heros()).toEqual(heroes);
    expect(component.filteredHeros()).toEqual(heroes);
  });

  it('should delete hero', () => {
    const hero: HeroWithAgeGroup = { id: 1, name: 'Hero 1', age: 25, ageGroup: 'Adulto' };
    const dialogRefMock = { afterClosed: () => of({ success: true }) };
    const updatedHeroes: HeroWithAgeGroup[] = [];

    mockDialog.open.and.returnValue(dialogRefMock);
    mockCommonsLibService.deleteHero.and.returnValue(of(updatedHeroes));

    component.deleteHero(hero);

    expect(mockDialog.open).toHaveBeenCalledOnceWith(jasmine.anything(), jasmine.any(Object));
    expect(mockCommonsLibService.deleteHero).toHaveBeenCalledOnceWith(hero.id);
    expect(component.heros()).toEqual(updatedHeroes);
    expect(component.filteredHeros()).toEqual(updatedHeroes);
    expect(mockSnackBar.open).toHaveBeenCalledOnceWith('Héroe eliminado', 'Cerrar', jasmine.any(Object));
  });

  it('should filter heroes', () => {
    const heroes: HeroWithAgeGroup[] = [{ id: 1, name: 'Hero 1', age: 25, ageGroup: 'Adulto' }, { id: 2, name: 'Hero 2', age: 18, ageGroup: 'Adolescente' }];
    component.heros.set(heroes);
    const event = { target: { value: 'Hero 1' }};

    component.filterHeros(event);

    expect(component.filteredHeros()).toEqual([{ id: 1, name: 'Hero 1', age: 25, ageGroup: 'Adulto' }]);
  });
});
