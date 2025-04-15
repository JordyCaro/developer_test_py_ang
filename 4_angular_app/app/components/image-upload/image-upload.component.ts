import { Component, ElementRef, ViewChild, signal, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StainCalculationService } from '../../services/stain-calculation.service';
import { Point } from '../../models/point.model';
import { CalculationResult } from '../../models/calculation.model';

// PrimeNG
import { FileUploadModule } from 'primeng/fileupload';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    FileUploadModule,
    SliderModule,
    ButtonModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="card">
      <h2>Cálculo de Área de Mancha</h2>
      
      <p-toast></p-toast>
      
      <div class="upload-container" *ngIf="!imageLoaded()">
        <p-fileUpload 
          mode="basic" 
          chooseLabel="Seleccionar Imagen" 
          accept="image/*" 
          [maxFileSize]="1000000"
          (onSelect)="onFileSelect($event)"
          [customUpload]="true"
          (uploadHandler)="onUpload($event)">
        </p-fileUpload>
        <small>* Sube una imagen binaria donde los píxeles blancos representan la mancha.</small>
      </div>
      
      <div class="image-container" *ngIf="imageLoaded()">
        <div class="image-preview">
          <canvas #imageCanvas></canvas>
          <canvas #pointsCanvas class="points-canvas"></canvas>
        </div>
        
        <div class="controls">
          <div class="control-item">
            <label for="pointSlider">Número de puntos aleatorios: {{ numPoints() }}</label>
            <p-slider 
              [(ngModel)]="numPointsSlider" 
              [min]="100" 
              [max]="10000" 
              [step]="100"
              (onChange)="onSliderChange()">
            </p-slider>
          </div>
          
          <div class="actions">
            <p-button label="Calcular Área" icon="pi pi-calculator" (onClick)="calculateArea()"></p-button>
            <p-button label="Nueva Imagen" icon="pi pi-image" styleClass="p-button-secondary" (onClick)="resetImage()"></p-button>
          </div>
        </div>
        
        <div class="result-panel" *ngIf="calculationResult()">
          <h3>Resultados del Cálculo</h3>
          <div class="result-grid">
            <div class="result-item">
              <span class="label">Puntos Totales:</span>
              <span class="value">{{ calculationResult()!.totalPoints }}</span>
            </div>
            <div class="result-item">
              <span class="label">Puntos en la Mancha:</span>
              <span class="value">{{ calculationResult()!.pointsInStain }}</span>
            </div>
            <div class="result-item">
              <span class="label">Área Total de la Imagen:</span>
              <span class="value">{{ calculationResult()!.imageWidth * calculationResult()!.imageHeight }} px²</span>
            </div>
            <div class="result-item">
              <span class="label">Área Estimada de la Mancha:</span>
              <span class="value">{{ calculationResult()!.estimatedArea.toFixed(2) }} px²</span>
            </div>
            <div class="result-item">
              <span class="label">Porcentaje del Área:</span>
              <span class="value">{{ calculationResult()!.areaPercentage.toFixed(2) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
      background-color: #f9f9f9;
      border: 2px dashed #ccc;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .upload-container small {
      margin-top: 10px;
      color: #666;
    }
    
    .image-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .image-preview {
      position: relative;
      max-width: 100%;
      margin: 0 auto;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    
    canvas {
      display: block;
      max-width: 100%;
    }
    
    .points-canvas {
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }
    
    .controls {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }
    
    .control-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 10px;
    }
    
    .result-panel {
      background-color: #e8f5e9;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
    }
    
    .result-panel h3 {
      color: #2e7d32;
      margin-top: 0;
      margin-bottom: 15px;
      text-align: center;
    }
    
    .result-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    
    .result-item {
      display: flex;
      flex-direction: column;
    }
    
    .label {
      font-weight: bold;
      font-size: 0.9rem;
      color: #555;
    }
    
    .value {
      font-size: 1.1rem;
      margin-top: 5px;
    }
  `]
})
export class ImageUploadComponent implements AfterViewInit {
  @ViewChild('imageCanvas', { static: false }) imageCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pointsCanvas', { static: false }) pointsCanvas!: ElementRef<HTMLCanvasElement>;
  
  // Signals
  imageLoaded = signal<boolean>(false);
  numPoints = signal<number>(1000);
  calculationResult = signal<CalculationResult | null>(null);
  
  // Tradicional
  numPointsSlider: number = 1000;
  private imageContext: CanvasRenderingContext2D | null = null;
  private pointsContext: CanvasRenderingContext2D | null = null;
  private imageData: ImageData | null = null;
  private currentImage: HTMLImageElement | null = null;
  private fileName: string = '';
  
  constructor(
    private calculationService: StainCalculationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngAfterViewInit(): void {
    console.log('Componente inicializado');
  }
  
  onFileSelect(event: any): void {
    console.log('Archivo seleccionado', event);
    const files = event.files;
    if (files && files.length > 0) {
      this.fileName = files[0].name;
      this.processFile(files[0]);
    }
  }
  
  onUpload(event: any): void {
    console.log('Archivo subido', event);
    const file = event.files[0];
    if (!file) return;
    
    this.processFile(file);
  }

  processFile(file: File): void {
    console.log('Procesando archivo:', file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        this.loadImage(e.target.result as string);
      }
    };
    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo leer la imagen seleccionada.'
      });
    };
    reader.readAsDataURL(file);
  }
  
  loadImage(src: string): void {
    console.log('Cargando imagen');
    
    const img = new Image();
    img.onload = () => {
      console.log('Imagen cargada, dimensiones:', img.width, 'x', img.height);
      this.currentImage = img;
      
      // Establecer que la imagen está cargada antes de configurar los canvas
      this.imageLoaded.set(true);
      
      // Forzar la detección de cambios para que se creen los canvas en el DOM
      this.cdr.detectChanges();
      
      // Ahora configuramos los canvas después de que existan en el DOM
      setTimeout(() => {
        if (!this.imageCanvas || !this.pointsCanvas) {
          console.error('Los canvas no se han inicializado correctamente');
          return;
        }
        
        try {
          // Configurar el canvas de la imagen
          this.imageCanvas.nativeElement.width = img.width;
          this.imageCanvas.nativeElement.height = img.height;
          this.imageContext = this.imageCanvas.nativeElement.getContext('2d');
          
          if (!this.imageContext) {
            throw new Error('No se pudo obtener el contexto 2D del canvas de imagen');
          }
          
          this.imageContext.drawImage(img, 0, 0);
          this.imageData = this.imageContext.getImageData(0, 0, img.width, img.height);
          
          // Configurar el canvas de puntos
          this.pointsCanvas.nativeElement.width = img.width;
          this.pointsCanvas.nativeElement.height = img.height;
          this.pointsContext = this.pointsCanvas.nativeElement.getContext('2d');
          
          if (!this.pointsContext) {
            throw new Error('No se pudo obtener el contexto 2D del canvas de puntos');
          }
          
          // Generar puntos iniciales
          this.generatePoints();
        } catch (error) {
          console.error('Error al configurar los canvas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al configurar el procesamiento de la imagen.'
          });
        }
      }, 100);
    };
    img.onerror = () => {
      console.error('Error al cargar la imagen');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar la imagen. Asegúrate de que sea un formato válido.'
      });
    };
    img.src = src;
  }
  
  onSliderChange(): void {
    this.numPoints.set(this.numPointsSlider);
    if (this.imageLoaded()) {
      this.generatePoints();
    }
  }
  
  generatePoints(): void {
    console.log('Generando puntos');
    if (!this.imageData || !this.pointsContext) {
      console.error('No hay datos de imagen o contexto de canvas disponibles');
      return;
    }
    
    const width = this.imageData.width;
    const height = this.imageData.height;
    
    // Generar puntos aleatorios
    const points = this.calculationService.generateRandomPoints(width, height, this.numPoints());
    
    // Comprobar si los puntos están dentro de la mancha
    const pointsWithStainInfo = this.calculationService.checkPointsInStain(points, this.imageData);
    
    // Dibujar los puntos
    this.drawPoints(pointsWithStainInfo);
  }
  
  drawPoints(points: Point[]): void {
    if (!this.pointsContext || !this.pointsCanvas) {
      console.error('Canvas de puntos no inicializado');
      return;
    }
    
    // Limpiar el canvas
    this.pointsContext.clearRect(0, 0, this.pointsCanvas.nativeElement.width, this.pointsCanvas.nativeElement.height);
    
    // Dibujar los puntos
    points.forEach(point => {
      if (!this.pointsContext) return;
      
      this.pointsContext.fillStyle = point.inStain ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)';
      this.pointsContext.beginPath();
      this.pointsContext.arc(point.x, point.y, 2, 0, Math.PI * 2);
      this.pointsContext.fill();
    });
  }
  
  calculateArea(): void {
    console.log('Calculando área');
    if (!this.imageData) {
      console.error('No hay datos de imagen disponibles');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay imagen cargada para calcular'
      });
      return;
    }
    
    const points = this.calculationService.randomPoints();
    console.log('Puntos generados:', points.length);
    
    if (points.length === 0) {
      console.error('No hay puntos generados');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron generar puntos aleatorios'
      });
      return;
    }
    
    const result = this.calculationService.calculateStainArea(
      points,
      this.imageData.width,
      this.imageData.height,
      this.fileName
    );
    
    console.log('Resultado del cálculo:', result);
    this.calculationResult.set(result);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Cálculo completado',
      detail: `Área estimada: ${result.estimatedArea.toFixed(2)} px² (${result.areaPercentage.toFixed(2)}%)`
    });
  }
  
  resetImage(): void {
    console.log('Reseteando imagen');
    this.imageLoaded.set(false);
    this.calculationResult.set(null);
    this.numPointsSlider = 1000;
    this.numPoints.set(1000);
    this.fileName = '';
    this.currentImage = null;
    this.imageData = null;
    
    // Limpiar los canvas si existen
    if (this.imageContext && this.imageCanvas) {
      this.imageContext.clearRect(0, 0, this.imageCanvas.nativeElement.width, this.imageCanvas.nativeElement.height);
    }
    
    if (this.pointsContext && this.pointsCanvas) {
      this.pointsContext.clearRect(0, 0, this.pointsCanvas.nativeElement.width, this.pointsCanvas.nativeElement.height);
    }
  }
} 