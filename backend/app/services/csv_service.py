import pandas as pd
import os
from typing import List, Dict, Any
from datetime import datetime

class CSVManager:
    def __init__(self, csv_path: str):
        self.csv_path = csv_path
        self._ensure_csv_exists()
        
    def _ensure_csv_exists(self):
        """Create CSV file with headers if it doesn't exist"""
        if not os.path.exists(self.csv_path):
            os.makedirs(os.path.dirname(self.csv_path), exist_ok=True)
            df = pd.DataFrame(columns=[
                'id', 'input_text', 'script', 'audio_path', 
                'created_at', 'status', 'voice_type'
            ])
            df.to_csv(self.csv_path, index=False)

    def read_data(self) -> pd.DataFrame:
        """Read all data from CSV"""
        return pd.read_csv(self.csv_path)

    def append_row(self, data: Dict[str, Any]) -> int:
        """Append a new row to CSV and return its ID"""
        df = self.read_data()
        
        # Generate new ID
        new_id = 1 if len(df) == 0 else df['id'].max() + 1
        
        # Prepare new row
        new_row = {
            'id': new_id,
            'input_text': data.get('input_text', ''),
            'script': data.get('script', ''),
            'audio_path': data.get('audio_path', ''),
            'created_at': datetime.now().isoformat(),
            'status': data.get('status', 'pending'),
            'voice_type': data.get('voice_type', 'nova')
        }
        
        # Append to DataFrame and save
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        df.to_csv(self.csv_path, index=False)
        
        return new_id

    def update_row(self, row_id: int, data: Dict[str, Any]) -> bool:
        """Update an existing row in CSV"""
        df = self.read_data()
        
        if row_id not in df['id'].values:
            return False
        
        # Update the row
        for key, value in data.items():
            if key in df.columns:
                df.loc[df['id'] == row_id, key] = value
        
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