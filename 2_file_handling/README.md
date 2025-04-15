# File Handling and Array Operations

This project implements a `FileProcessor` class that handles various file operations including folder analysis, CSV processing, and DICOM file handling.

## Features

1. **Folder Content Listing**
   - Lists files and folders in a directory
   - Optional detailed view with file sizes and modification times
   - Error logging for missing folders

2. **CSV File Analysis**
   - Reads and analyzes CSV files
   - Calculates statistics for numeric columns
   - Optional summary of non-numeric columns
   - Saves analysis reports to text files

3. **DICOM File Processing**
   - Reads DICOM files using pydicom
   - Extracts patient information and metadata
   - Optional tag reading
   - Image extraction to PNG format

## Installation

1. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

```python
from file_processor import FileProcessor

# Initialize the processor
processor = FileProcessor(base_path="./data", log_file="file_processor.log")

# List folder contents
processor.list_folder_contents(folder_name="test_folder", details=True)

# Analyze CSV file
processor.read_csv(
    filename="sample-01-csv.csv",
    report_path="./reports",
    summary=True
)

# Process DICOM file
processor.read_dicom(
    filename="sample-01-dicom.dcm",
    tags=[(0x0010, 0x0010), (0x0008, 0x0060)],
    extract_image=True
)
```

## Example Output

```
Folder: ./data/test_folder
Number of elements: 5
Files:
 - file1.txt (1.2 MB, Last Modified: 2024-01-01 12:00:00)
 - file2.csv (0.8 MB, Last Modified: 2024-01-02 12:00:00)
Folders:
 - folder1 (Last Modified: 2024-01-01 15:00:00)
 - folder2 (Last Modified: 2024-01-03 16:00:00)

CSV Analysis:
Columns: ["Name", "Age", "Height"]
Rows: 100
Numeric Columns:
 - Age: Average = 30.5, Std Dev = 5.6
 - Height: Average = 170.2, Std Dev = 10.3
Non-Numeric Summary:
 - Name: Unique Values = 50

DICOM Analysis:
Patient Name: John Doe
Study Date: 2024-01-01
Modality: CT
Tag 0x0010, 0x0010: John Doe
Tag 0x0008, 0x0060: CT
Extracted image saved to ./data/sample-01-dicom.png
```

## Error Handling

The class includes comprehensive error handling and logging:
- All errors are logged to the specified log file
- Descriptive error messages are provided
- Graceful handling of missing files and invalid formats

## Requirements

- Python 3.7+
- pandas
- numpy
- pydicom
- Pillow 