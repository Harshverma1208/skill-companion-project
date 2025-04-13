import pandas as pd
import os

def convert_to_excel(csv_filename, sheet_name):
    # Get the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Read the CSV file
    csv_path = os.path.join(current_dir, csv_filename)
    df = pd.read_csv(csv_path)
    
    # Create Excel writer object
    excel_path = os.path.join(current_dir, f"{csv_filename.replace('.csv', '.xlsx')}")
    writer = pd.ExcelWriter(excel_path, engine='openpyxl')
    
    # Convert dataframe to Excel
    df.to_excel(writer, index=False, sheet_name=sheet_name)
    
    # Auto-adjust columns' width
    for column in df:
        column_width = max(df[column].astype(str).map(len).max(), len(column))
        col_idx = df.columns.get_loc(column)
        writer.sheets[sheet_name].column_dimensions[chr(65 + col_idx)].width = column_width + 2
    
    # Save the Excel file
    writer.save()
    print(f"Created Excel file: {excel_path}")

# Convert all CSV files
files_to_convert = [
    ('skill_trends.csv', 'Technical Skills'),
    ('emerging_skill_trends.csv', 'Emerging Tech'),
    ('non_technical_trends.csv', 'Non-Technical Skills')
]

for csv_file, sheet_name in files_to_convert:
    convert_to_excel(csv_file, sheet_name) 