import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StainCalculationService } from '../../services/stain-calculation.service';
import { CalculationResult } from '../../models/calculation.model';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-calculation-result',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CardModule],
  template: `
    <div class="card">
      <h2>Historial de Cálculos</h2>
      
      <p *ngIf="!results.length" class="no-results">
        No hay cálculos previos para mostrar.
      </p>
      
      <p-table 
        *ngIf="results.length" 
        [value]="results" 
        [paginator]="true" 
        [rows]="5"
        [showCurrentPageReport]="true" 
        [tableStyle]="{ 'min-width': '50rem' }"
        styleClass="p-datatable-sm">
        
        <ng-template pTemplate="header">
          <tr>
            <th>Fecha</th>
            <th>Imagen</th>
            <th>Puntos Totales</th>
            <th>Puntos en Mancha</th>
            <th>Dimensiones (px)</th>
            <th>Área Estimada (px²)</th>
            <th>Porcentaje</th>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="body" let-result>
          <tr>
            <td>{{ result.timestamp | date:'short' }}</td>
            <td>{{ result.imageFileName }}</td>
            <td>{{ result.totalPoints }}</td>
            <td>{{ result.pointsInStain }}</td>
            <td>{{ result.imageWidth }} × {{ result.imageHeight }}</td>
            <td>{{ result.estimatedArea.toFixed(2) }}</td>
            <td>{{ result.areaPercentage.toFixed(2) }}%</td>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="paginatorleft">
          <p>Total: {{ results.length }} cálculos</p>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    .no-results {
      padding: 20px;
      text-align: center;
      background-color: #f8f9fa;
      border-radius: 4px;
      color: #6c757d;
    }
    
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background-color: #f5f5f5;
    }
    
    h2 {
      margin-bottom: 20px;
    }
  `]
})
export class CalculationResultComponent implements OnInit {
  results: CalculationResult[] = [];
  
  constructor(private calculationService: StainCalculationService) {}
  
  ngOnInit(): void {
    this.calculationService.calculationResults$.subscribe(results => {
      this.results = results;
    });
  }
} 