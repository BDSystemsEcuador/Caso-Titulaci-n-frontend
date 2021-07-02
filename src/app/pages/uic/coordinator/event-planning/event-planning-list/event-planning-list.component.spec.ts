import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPlanningListComponent } from './event-planning-list.component';

describe('EventPlanningListComponent', () => {
  let component: EventPlanningListComponent;
  let fixture: ComponentFixture<EventPlanningListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventPlanningListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPlanningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
