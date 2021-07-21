import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementDeleteFormComponent } from './requirement-delete-form.component';

describe('RequirementDeleteFormComponent', () => {
  let component: RequirementDeleteFormComponent;
  let fixture: ComponentFixture<RequirementDeleteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequirementDeleteFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementDeleteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
