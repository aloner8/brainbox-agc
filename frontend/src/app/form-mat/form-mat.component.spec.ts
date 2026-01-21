import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMatComponent } from './form-mat.component';

describe('FormMatComponent', () => {
  let component: FormMatComponent;
  let fixture: ComponentFixture<FormMatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
