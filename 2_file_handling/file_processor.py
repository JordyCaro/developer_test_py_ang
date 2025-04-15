import os
import logging
from typing import List, Tuple, Optional
import pandas as pd
import numpy as np
from datetime import datetime
import pydicom
from PIL import Image
import io

class FileProcessor:
    """
    A class to handle various file processing operations including folder analysis,
    CSV processing, and DICOM file handling.
    """
    
    def __init__(self, base_path: str, log_file: str):
        """
        Initialize FileProcessor with base path and logging configuration.
        
        Args:
            base_path (str): Root folder for file operations
            log_file (str): Path to the log file
        """
        self.base_path = os.path.abspath(base_path)
        
        # Configure logging
        self.logger = logging.getLogger('FileProcessor')
        self.logger.setLevel(logging.INFO)
        
        # Create file handler
        fh = logging.FileHandler(log_file)
        fh.setLevel(logging.INFO)
        
        # Create formatter
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        fh.setFormatter(formatter)
        
        # Add handler to logger
        self.logger.addHandler(fh)
        
        # Create base path if it doesn't exist
        if not os.path.exists(self.base_path):
            os.makedirs(self.base_path)
            self.logger.info(f"Created base path: {self.base_path}")
    
    def list_folder_contents(self, folder_name: str, details: bool = False) -> None:
        """
        List contents of a folder with optional detailed information.
        
        Args:
            folder_name (str): Name of folder relative to base_path
            details (bool): Whether to include size and modification time
        """
        folder_path = os.path.join(self.base_path, folder_name)
        
        try:
            if not os.path.exists(folder_path):
                raise FileNotFoundError(f"Folder not found: {folder_path}")
            
            items = os.listdir(folder_path)
            print(f"\nFolder: {folder_path}")
            print(f"Number of elements: {len(items)}")
            
            files = []
            folders = []
            
            for item in items:
                item_path = os.path.join(folder_path, item)
                is_file = os.path.isfile(item_path)
                
                if details:
                    mod_time = datetime.fromtimestamp(os.path.getmtime(item_path))
                    mod_time_str = mod_time.strftime("%Y-%m-%d %H:%M:%S")
                    
                    if is_file:
                        size_mb = os.path.getsize(item_path) / (1024 * 1024)
                        files.append(f" - {item} ({size_mb:.1f} MB, Last Modified: {mod_time_str})")
                    else:
                        folders.append(f" - {item} (Last Modified: {mod_time_str})")
                else:
                    if is_file:
                        files.append(f" - {item}")
                    else:
                        folders.append(f" - {item}")
            
            if files:
                print("\nFiles:")
                print("\n".join(files))
            if folders:
                print("\nFolders:")
                print("\n".join(folders))
                
        except Exception as e:
            self.logger.error(f"Error listing folder contents: {str(e)}")
            raise
    
    def read_csv(self, filename: str, report_path: Optional[str] = None, summary: bool = False) -> None:
        """
        Read and analyze a CSV file.
        
        Args:
            filename (str): Name of the CSV file in base_path
            report_path (Optional[str]): Path to save analysis report
            summary (bool): Whether to include summary of non-numeric columns
        """
        try:
            file_path = os.path.join(self.base_path, filename)
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"CSV file not found: {file_path}")
            
            # Read CSV file
            df = pd.read_csv(file_path)
            
            print("\nCSV Analysis:")
            print(f"Columns: {df.columns.tolist()}")
            print(f"Rows: {len(df)}")
            
            # Analyze numeric columns
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            print("\nNumeric Columns:")
            
            analysis_text = []
            for col in numeric_cols:
                avg = df[col].mean()
                std = df[col].std()
                print(f" - {col}: Average = {avg:.1f}, Std Dev = {std:.1f}")
                analysis_text.append(f"{col}:\n  Average: {avg:.1f}\n  Standard Deviation: {std:.1f}")
            
            # Analyze non-numeric columns if summary is True
            if summary:
                non_numeric_cols = df.select_dtypes(exclude=[np.number]).columns
                if len(non_numeric_cols) > 0:
                    print("\nNon-Numeric Summary:")
                    for col in non_numeric_cols:
                        unique_count = df[col].nunique()
                        print(f" - {col}: Unique Values = {unique_count}")
                        if report_path:
                            analysis_text.append(f"\n{col}:\n  Unique Values: {unique_count}")
            
            # Save report if path is provided
            if report_path:
                if not os.path.exists(report_path):
                    os.makedirs(report_path)
                report_file = os.path.join(report_path, f"{os.path.splitext(filename)[0]}_analysis.txt")
                with open(report_file, 'w') as f:
                    f.write("\n".join(analysis_text))
                print(f"\nSaved summary report to {report_path}")
                
        except Exception as e:
            self.logger.error(f"Error processing CSV file: {str(e)}")
            raise
    
    def read_dicom(self, filename: str, tags: Optional[List[Tuple[int, int]]] = None, 
                  extract_image: bool = False) -> None:
        """
        Read and analyze a DICOM file.
        
        Args:
            filename (str): Name of the DICOM file in base_path
            tags (Optional[List[Tuple[int, int]]]): List of DICOM tags to read
            extract_image (bool): Whether to extract and save image data
        """
        try:
            file_path = os.path.join(self.base_path, filename)
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"DICOM file not found: {file_path}")
            
            # Read DICOM file
            ds = pydicom.dcmread(file_path)
            
            print("\nDICOM Analysis:")
            try:
                print(f"Patient Name: {ds.PatientName}")
            except:
                print("Patient Name: Not available")
            
            try:
                print(f"Study Date: {ds.StudyDate}")
            except:
                print("Study Date: Not available")
            
            try:
                print(f"Modality: {ds.Modality}")
            except:
                print("Modality: Not available")
            
            # Print requested tags
            if tags:
                for tag in tags:
                    try:
                        value = ds[tag].value
                        print(f"Tag {hex(tag[0])}, {hex(tag[1])}: {value}")
                    except:
                        print(f"Tag {hex(tag[0])}, {hex(tag[1])}: Not available")
            
            # Extract image if requested
            if extract_image and hasattr(ds, 'pixel_array'):
                try:
                    pixel_array = ds.pixel_array
                    
                    # Normalize pixel values to 0-255 range
                    if pixel_array.max() > 255:
                        pixel_array = ((pixel_array - pixel_array.min()) / 
                                     (pixel_array.max() - pixel_array.min()) * 255).astype(np.uint8)
                    
                    # Create image and save
                    image = Image.fromarray(pixel_array)
                    output_path = os.path.join(self.base_path, 
                                             f"{os.path.splitext(filename)[0]}.png")
                    image.save(output_path)
                    print(f"Extracted image saved to {output_path}")
                except Exception as e:
                    self.logger.error(f"Error extracting DICOM image: {str(e)}")
                    raise
                    
        except Exception as e:
            self.logger.error(f"Error processing DICOM file: {str(e)}")
            raise

# Example usage
if __name__ == "__main__":
    # Create processor instance
    processor = FileProcessor(base_path="./data", log_file="file_processor.log")
    
    # Test folder listing
    try:
        processor.list_folder_contents(folder_name="test_folder", details=True)
    except Exception as e:
        print(f"Error listing folder: {str(e)}")
    
    # Test CSV analysis
    try:
        processor.read_csv(filename="sample-01-csv.csv", 
                         report_path="./reports",
                         summary=True)
    except Exception as e:
        print(f"Error analyzing CSV: {str(e)}")
    
    # Test DICOM analysis
    try:
        processor.read_dicom(
            filename="sample-01-dicom.dcm",
            tags=[(0x0010, 0x0010), (0x0008, 0x0060)],
            extract_image=True
        )
    except Exception as e:
        print(f"Error analyzing DICOM: {str(e)}") 