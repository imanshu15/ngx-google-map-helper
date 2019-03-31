import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGoogleMapHelperComponent } from './ngx-google-map-helper.component';

describe('NgxGoogleMapHelperComponent', () => {
  let component: NgxGoogleMapHelperComponent;
  let fixture: ComponentFixture<NgxGoogleMapHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxGoogleMapHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGoogleMapHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
