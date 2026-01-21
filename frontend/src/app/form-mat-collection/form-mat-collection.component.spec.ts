import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMatCollectionComponent } from './form-mat-collection.component';

describe('FormMatCollectionComponent', () => {
  let component: FormMatCollectionComponent;
  let fixture: ComponentFixture<FormMatCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMatCollectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormMatCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
