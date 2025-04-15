# Stain Area Calculator

## Description

This Angular application calculates the area of a stain in a binary image using a Monte Carlo method. Users can upload an image, adjust the number of random points for calculation, and visualize the results, as well as check the history of previous calculations.

## Methodology

1. Upload a binary image where white pixels represent the stain and black pixels represent the background
2. The application generates n random 2D points inside the image dimensions
3. Count the number of random points that fall inside the stain (ni)
4. Estimate the stain area as: Area = (Total Image Area) × (ni/n)

## Implemented Features

- Interface divided into two tabs: one for calculations and another for history
- Carousel explaining the methodology step by step
- Slider to adjust the number of random points
- Visualization of generated points on the image (green points inside the stain, red points outside)
- History table with pagination
- Storage of results in localStorage

## Technologies Used

- Angular 17 with standalone components
- PrimeNG for UI components (Tables, Carousel, Buttons, etc.)
- RxJS for state management (BehaviorSubject)
- Angular Signals for reactive state
- Canvas API for image and point visualization

## File Structure

- `app/models/`: Interfaces for Point and CalculationResult
- `app/services/`: Service that implements the calculation logic
- `app/components/`: 
  - `main/`: Main component with tabs
  - `methodology/`: Explanatory carousel component
  - `image-upload/`: Component for uploading and processing images
  - `calculation-result/`: History table component

## Instructions to Run

1. Install dependencies:
```
npm install
```

2. Start the application:
```
npm start
``` 