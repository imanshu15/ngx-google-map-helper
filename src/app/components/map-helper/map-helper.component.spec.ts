import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapHelperComponent } from './map-helper.component';

describe('MapHelperComponent', () => {
  let component: MapHelperComponent;
  let fixture: ComponentFixture<MapHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
