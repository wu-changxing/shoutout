from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os

from app.services.summaries_service import SummariesService
from app.core.config import settings

router = APIRouter()

class PDFProcessRequest(BaseModel):
    pdf_path: str

class PDFProcessResponse(BaseModel):
    detail: str

@router.post("/process/", response_model=PDFProcessResponse)
async def process_pdf(request: PDFProcessRequest, background_tasks: BackgroundTasks):
    """
    Endpoint to process a PDF document and extract summaries.

    The PDF file must be available on the server. The processing happens in the background
    (using FastAPI's BackgroundTasks) so that the client receives an immediate confirmation.
    """
    try:
        summaries_service = SummariesService()
        background_tasks.add_task(summaries_service.process_pdf_document, request.pdf_path)
        return PDFProcessResponse(detail="PDF processing started successfully.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))