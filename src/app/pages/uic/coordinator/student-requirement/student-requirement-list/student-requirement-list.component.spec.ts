import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRequirementListComponent } from './student-requirement-list.component';

describe('StudentRequirementListComponent', () => {
  let component: StudentRequirementListComponent;
  let fixture: ComponentFixture<StudentRequirementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentRequirementListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentRequirementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
