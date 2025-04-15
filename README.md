# Developer Test Solutions

This repository contains the solutions for the developer test, organized into separate folders for each exercise. Each solution implements the requirements specified in the test document and includes its own detailed documentation.

## Repository Structure

- **1_recursion_and_colors/**: Exercise focused on recursion algorithms and color processing.
- **2_file_handling/**: Exercise on handling different file formats including DICOM medical images and CSV files.
- **3_rest_api/**: Implementation of a REST API for data processing and manipulation.
- **4/**: Angular application for calculating stain area in binary images.

## Solutions Overview

Each folder contains a complete solution for the corresponding exercise, including:

- Source code implementing the requirements
- Proper documentation explaining the approach
- Configuration files where needed
- Unit tests when applicable

## Exercise 4: Stain Area Calculator

The Angular application in folder `4/` implements a tool to compute the area of a stain in a binary image using a Monte Carlo method. The application:

1. Allows uploading binary images where white pixels represent the stain
2. Generates random points inside the image dimensions
3. Counts points that fall inside the stain
4. Estimates the stain area using the ratio of points inside the stain to total points

### Features

- Two-tab interface (calculation and results history)
- Step-by-step methodology explanation
- Interactive controls for setting the number of random points
- Real-time visualization of points on the image
- Results table with pagination
- Data persistence using localStorage

### Technologies

- Angular 17 with standalone components
- PrimeNG for UI components
- RxJS for state management
- Angular Signals for reactive state

## Running the Projects

Each folder contains its own README file with specific instructions on how to set up and run that particular exercise.

For any questions or clarifications, please refer to the detailed documentation within each project folder. 