import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

interface Step {
  title: string;
  description: string;
  image?: string;
}

@Component({
  selector: 'app-methodology',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  template: `
    <div class="card">
      <h2>Metodología de Cálculo</h2>
      
      <p-carousel [value]="steps" [numVisible]="1" [numScroll]="1" [circular]="false" [showNavigators]="true">
        <ng-template let-step pTemplate="item">
          <div class="methodology-step">
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
            <div class="step-image" *ngIf="step.image">
              <img [src]="step.image" [alt]="step.title">
            </div>
          </div>
        </ng-template>
      </p-carousel>
    </div>
  `,
  styles: [`
    .methodology-step {
      padding: 20px;
      text-align: center;
      height: 220px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .step-image {
      max-width: 200px;
      margin: 0 auto;
    }
    
    h3 {
      color: #3f51b5;
      margin-bottom: 10px;
    }
    
    p {
      line-height: 1.6;
    }
  `]
})
export class MethodologyComponent {
  steps: Step[] = [
    {
      title: 'Paso 1: Subir una imagen binaria',
      description: 'Sube una imagen binaria donde los píxeles blancos representan la mancha y los píxeles negros representan el fondo.'
    },
    {
      title: 'Paso 2: Generar puntos aleatorios',
      description: 'La aplicación genera n puntos aleatorios dentro de las dimensiones de la imagen.'
    },
    {
      title: 'Paso 3: Contar puntos dentro de la mancha',
      description: 'El sistema cuenta cuántos de estos puntos aleatorios caen dentro de la mancha (ni).'
    },
    {
      title: 'Paso 4: Estimar el área',
      description: 'El área de la mancha se estima como: Área = (Área total de la imagen) × (ni/n)'
    }
  ];
} 