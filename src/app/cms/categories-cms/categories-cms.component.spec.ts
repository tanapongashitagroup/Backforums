import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesCMSComponent } from './categories-cms.component';

describe('CategoriesCMSComponent', () => {
  let component: CategoriesCMSComponent;
  let fixture: ComponentFixture<CategoriesCMSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesCMSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesCMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
