import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostlistCMSComponent } from './postlist-cms.component';

describe('PostlistCMSComponent', () => {
  let component: PostlistCMSComponent;
  let fixture: ComponentFixture<PostlistCMSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostlistCMSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostlistCMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
