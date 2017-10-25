import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPageviewsComponent } from './config-pageviews.component';

describe('ConfigPageviewsComponent', () => {
  let component: ConfigPageviewsComponent;
  let fixture: ComponentFixture<ConfigPageviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigPageviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPageviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
