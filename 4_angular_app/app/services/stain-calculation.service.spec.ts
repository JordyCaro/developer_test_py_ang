import { TestBed } from '@angular/core/testing';
import { StainCalculationService } from './stain-calculation.service';
import { Point } from '../models/point.model';

describe('StainCalculationService', () => {
  let service: StainCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StainCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate the correct number of random points', () => {
    const width = 100;
    const height = 100;
    const numPoints = 500;

    const points = service.generateRandomPoints(width, height, numPoints);

    expect(points.length).toBe(numPoints);
    // Verificar que los puntos estén dentro de los límites
    points.forEach(point => {
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThan(width);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThan(height);
    });
  });

  it('should calculate stain area correctly', () => {
    const width = 100;
    const height = 100;
    const totalPoints = 1000;
    const pointsInStain = 250;
    const fileName = 'test.png';
    
    // Crear puntos de prueba
    const points: Point[] = [];
    
    // Crear puntos dentro de la mancha
    for (let i = 0; i < pointsInStain; i++) {
      points.push({ x: i, y: i, inStain: true });
    }
    
    // Crear puntos fuera de la mancha
    for (let i = pointsInStain; i < totalPoints; i++) {
      points.push({ x: i, y: i, inStain: false });
    }
    
    const result = service.calculateStainArea(points, width, height, fileName);
    
    // Verificar resultado
    expect(result.totalPoints).toBe(totalPoints);
    expect(result.pointsInStain).toBe(pointsInStain);
    expect(result.imageWidth).toBe(width);
    expect(result.imageHeight).toBe(height);
    expect(result.areaPercentage).toBe(25); // 250/1000 * 100
    expect(result.estimatedArea).toBe(2500); // 100*100 * 0.25
  });
}); 