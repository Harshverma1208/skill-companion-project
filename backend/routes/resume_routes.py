from fastapi import APIRouter, UploadFile, File
from services.resume_analyzer_service import ResumeAnalyzerService

router = APIRouter()
resume_service = ResumeAnalyzerService()

@router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    """
    Analyze uploaded resume and provide comprehensive analysis
    """
    if not file.filename.lower().endswith('.pdf'):
        return {
            "error": "Invalid file format. Please upload a PDF file."
        }
    
    analysis = await resume_service.analyze_resume(file)
    return analysis

@router.get("/job-matches/{job_title}")
async def get_job_matches(job_title: str):
    """
    Get detailed job market analysis for a specific job title
    """
    market_analysis = resume_service.job_analyzer.analyze_job_market(job_title)
    return market_analysis 