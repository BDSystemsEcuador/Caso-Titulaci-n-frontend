import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPlanFormComponent } from './project-plan-form.component';

describe('ProjectPlanFormComponent', () => {
  let component: ProjectPlanFormComponent;
  let fixture: ComponentFixture<ProjectPlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPlanFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
