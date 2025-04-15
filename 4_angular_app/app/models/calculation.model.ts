export interface CalculationResult {
  id: string;
  timestamp: Date;
  imageFileName: string;
  totalPoints: number;
  pointsInStain: number;
  imageWidth: number;
  imageHeight: number;
  estimatedArea: number;
  areaPercentage: number;
} 