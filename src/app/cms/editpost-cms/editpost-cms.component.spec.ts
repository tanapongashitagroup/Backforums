import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditpostCMSComponent } from './editpost-cms.component';

describe('EditpostCMSComponent', () => {
  let component: EditpostCMSComponent;
  let fixture: ComponentFixture<EditpostCMSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditpostCMSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditpostCMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
