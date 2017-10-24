import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportExampleComponent } from './report-example.component';

describe('ReportExampleComponent', () => {
  let component: ReportExampleComponent;
  let fixture: ComponentFixture<ReportExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
