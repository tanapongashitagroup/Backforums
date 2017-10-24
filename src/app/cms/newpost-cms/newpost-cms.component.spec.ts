import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpostCMSComponent } from './newpost-cms.component';

describe('NewpostCMSComponent', () => {
  let component: NewpostCMSComponent;
  let fixture: ComponentFixture<NewpostCMSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewpostCMSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewpostCMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
