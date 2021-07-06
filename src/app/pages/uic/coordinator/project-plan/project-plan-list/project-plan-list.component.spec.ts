import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPlanListComponent } from './project-plan-list.component';

describe('ProjectPlanListComponent', () => {
  let component: ProjectPlanListComponent;
  let fixture: ComponentFixture<ProjectPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPlanListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
