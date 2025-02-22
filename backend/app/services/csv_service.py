import pandas as pd
import os
from typing import List, Dict, Any, Union

from app.core.config import settings

class CSVManager:
    def __init__(self, csv_path: str, headers: List[str]):
        self.csv_path = csv_path
        self.headers = headers
        self._ensure_csv_exists(headers)
        
    def _ensure_csv_exists(self, headers):
        """Create CSV file with headers if it doesn't exist"""
        if not os.path.exists(self.csv_path):
            os.makedirs(os.path.dirname(self.csv_path), exist_ok=True)
            df = pd.DataFrame(columns=headers)
            df.to_csv(self.csv_path, index=False)

    def read_data(self) -> pd.DataFrame:
        """Read all data from CSV"""
        return pd.read_csv(self.csv_path)

    def append_rows(self, data: Union[Dict[str, Any], List[Dict[str, Any]]]) -> int:
        """Append a new row to CSV and return its ID"""
        if settings.DEBUG: print(f"Appending {len(data)} rows to CSV...")
        
        df = self.read_data()
        
        # Generate new ID
        next_id = 1 if len(df) == 0 else df['id'].max() + 1
        
        # Convert data to list if it's not already
        if not isinstance(data, list):
            data = [data]
        
        new_rows = []
        for i, row in enumerate(data):
          # Create a row with defaults for all headers
          new_row = {col: row.get(col, '') for col in self.headers}
          new_row.update({
            'id': next_id + i
          })
          new_rows.append(new_row)
      
        # Append to DataFrame and save
        df = pd.concat([df, pd.DataFrame(new_rows)], ignore_index=True)
        df.to_csv(self.csv_path, index=False)
        
        if settings.DEBUG: print(f"Appended {len(new_rows)} rows to CSV!")
      
        return next_id

    def update_row(self, row_id: int, data: Dict[str, Any]) -> bool:
        """Update an existing row in CSV"""
        df = self.read_data()
        
        if row_id not in df['id'].values:
            return False
        
        # Update the row
        for key, value in data.items():
            if key in df.columns:
                df.loc[df['id'] == int(row_id), key] = value
        
        df.to_csv(self.csv_path, index=False)
        return True

    def get_row(self, row_id: int) -> Dict[str, Any]:
        """Get a specific row by ID"""
        df = self.read_data()
        row = df[df['id'] == row_id]
        
        if len(row) == 0:
            return None
            
        return row.iloc[0].to_dict()

    def get_pending_rows(self) -> List[Dict[str, Any]]:
        """Get all rows with pending status"""
        df = self.read_data()
        pending = df[df['status'] == 'pending']
        return pending.to_dict('records') 
    
