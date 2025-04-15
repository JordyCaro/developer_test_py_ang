import { Injectable, signal } from '@angular/core';
import { Point } from '../models/point.model';
import { CalculationResult } from '../models/calculation.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StainCalculationService {
  private calculationResults = new BehaviorSubject<CalculationResult[]>([]);
  public calculationResults$ = this.calculationResults.asObservable();
  
  // Signal para almacenar los puntos generados
  public randomPoints = signal<Point[]>([]);
  
  constructor() {
    // Cargar resultados almacenados en localStorage al iniciar
    const savedResults = localStorage.getItem('calculationResults');
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        // Convertir las fechas de string a Date
        const resultsWithDates = parsedResults.map((result: any) => ({
          ...result,
          timestamp: new Date(result.timestamp)
        }));
        this.calculationResults.next(resultsWithDates);
      } catch (e) {
        console.error('Error al cargar resultados guardados:', e);
      }
    }
  }

  /**
   * Genera puntos aleatorios dentro de las dimensiones de la imagen
   */
  generateRandomPoints(width: number, height: number, numPoints: number): Point[] {
    const points: Point[] = [];
    
    for (let i = 0; i < numPoints; i++) {
      const point: Point = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        inStain: false
      };
      points.push(point);
    }
    
    this.randomPoints.set(points);
    return points;
  }

  /**
   * Determina si un punto está dentro o fuera de la mancha comprobando el valor del pixel
   */
  checkPointsInStain(points: Point[], imageData: ImageData): Point[] {
    const updatedPoints = [...points];
    
    for (let i = 0; i < updatedPoints.length; i++) {
      const point = updatedPoints[i];
      const pixelIndex = (point.y * imageData.width + point.x) * 4;
      
      // Si el pixel es blanco (255,255,255) está en la mancha
      const isWhite = 
        imageData.data[pixelIndex] === 255 && 
        imageData.data[pixelIndex + 1] === 255 && 
        imageData.data[pixelIndex + 2] === 255;
      
      updatedPoints[i] = {...point, inStain: isWhite};
    }
    
    this.randomPoints.set(updatedPoints);
    return updatedPoints;
  }

  /**
   * Calcula el área de la mancha basado en la proporción de puntos dentro de la mancha
   */
  calculateStainArea(points: Point[], imageWidth: number, imageHeight: number, fileName: string): CalculationResult {
    const totalPoints = points.length;
    const pointsInStain = points.filter(p => p.inStain).length;
    const totalArea = imageWidth * imageHeight;
    const areaPercentage = (pointsInStain / totalPoints) * 100;
    const estimatedArea = totalArea * (pointsInStain / totalPoints);
    
    const result: CalculationResult = {
      id: this.generateId(),
      timestamp: new Date(),
      imageFileName: fileName,
      totalPoints,
      pointsInStain,
      imageWidth,
      imageHeight,
      estimatedArea,
      areaPercentage
    };
    
    this.saveResult(result);
    return result;
  }
  
  /**
   * Guarda un resultado de cálculo en el historial
   */
  private saveResult(result: CalculationResult): void {
    const currentResults = this.calculationResults.value;
    const updatedResults = [result, ...currentResults];
    
    this.calculationResults.next(updatedResults);
    
    // Guardar en localStorage
    localStorage.setItem('calculationResults', JSON.stringify(updatedResults));
  }
  
  /**
   * Genera un ID único para cada cálculo
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
} 