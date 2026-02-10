# Oman Multi-Omics Training — Website + Backend (XLSX)

This package includes:
- A static website (front-end)
- A small Flask backend that stores registrations in an Excel file

## Run locally
1) Open a terminal in `backend/`
2) Install dependencies:
   - `pip install -r requirements.txt`
3) Start the server:
   - `python app.py`
4) Open:
   - http://localhost:5000

## Excel output
- File: `backend/data/registrations.xlsx`
- Sheets:
  - Participants
  - Sponsors

## Download the Excel file
- http://localhost:5000/api/download/xlsx
