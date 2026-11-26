import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VitrineComponent } from './vitrine';
import { CommonModule } from '@angular/common';
import { provideRouter } from '@angular/router';

describe('Vitrine', () => {
  let component: VitrineComponent;
  let fixture: ComponentFixture<VitrineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitrineComponent, CommonModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VitrineComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});