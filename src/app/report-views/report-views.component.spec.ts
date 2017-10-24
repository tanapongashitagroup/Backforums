import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewsComponent } from './report-views.component';

describe('ReportViewsComponent', () => {
  let component: ReportViewsComponent;
  let fixture: ComponentFixture<ReportViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
