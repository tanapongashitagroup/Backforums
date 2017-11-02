import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsTextComponent } from './ads-text.component';

describe('AdsTextComponent', () => {
  let component: AdsTextComponent;
  let fixture: ComponentFixture<AdsTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
