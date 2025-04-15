import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';

// Components
import { MethodologyComponent } from '../methodology/methodology.component';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { CalculationResultComponent } from '../calculation-result/calculation-result.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule, 
    TabViewModule,
    CardModule,
    MethodologyComponent,
    ImageUploadComponent,
    CalculationResultComponent
  ],
  template: `
    <div class="main-container">
      <app-methodology></app-methodology>
      
      <p-tabView styleClass="main-tabs">
        <p-tabPanel header="Calcular Área">
          <app-image-upload></app-image-upload>
        </p-tabPanel>
        
        <p-tabPanel header="Historial de Resultados">
          <app-calculation-result></app-calculation-result>
        </p-tabPanel>
      </p-tabView>
    </div>
  `,
  styles: [`
    .main-container {
      padding: 10px;
    }
    
    :host ::ng-deep .main-tabs .p-tabview-nav {
      background-color: #f5f5f5;
      border-radius: 8px 8px 0 0;
    }
    
    :host ::ng-deep .main-tabs .p-tabview-panels {
      background-color: white;
      border-radius: 0 0 8px 8px;
      padding: 10px;
    }
  `]
})
export class MainComponent {
} 