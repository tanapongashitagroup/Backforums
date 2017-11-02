import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ads4Component } from './ads4.component';

describe('Ads4Component', () => {
  let component: Ads4Component;
  let fixture: ComponentFixture<Ads4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ads4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ads4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
