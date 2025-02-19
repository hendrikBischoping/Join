import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedDialogComponent } from './detailed-dialog.component';

describe('DetailedDialogComponent', () => {
  let component: DetailedDialogComponent;
  let fixture: ComponentFixture<DetailedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
