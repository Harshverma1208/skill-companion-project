from fastapi import UploadFile, HTTPException
import PyPDF2
import io
from typing import Dict, List
import json
from ml.resume_analyzer import ResumeAnalyzer
from ml.job_analyzer import JobAnalyzer
from ml.skill_analyzer import SkillAnalyzer

class ResumeAnalyzerService:
    def __init__(self):
        self.resume_analyzer = ResumeAnalyzer()
        self.job_analyzer = JobAnalyzer()
        self.skill_analyzer = SkillAnalyzer()
        
    async def analyze_resume(self, file: UploadFile) -> Dict:
        """
        Analyze uploaded resume and provide comprehensive analysis
        """
        try:
            # Read PDF content
            content = await file.read()
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            
            # Extract text from all pages
            resume_text = ""
            for page in pdf_reader.pages:
                resume_text += page.extract_text()
            
            # Analyze resume using ML components
            resume_analysis = self.resume_analyzer.analyze_resume(resume_text)
            
            # Get skills from resume with confidence scores
            extracted_skills = resume_analysis['skills']
            
            # Analyze technical skills
            technical_skills = {
                skill['name']: skill['confidence']
                for skill in extracted_skills['technical']
            }
            
            # Get relevant job titles based on skills
            potential_jobs = self.job_analyzer.get_relevant_jobs(technical_skills)
            
            # Get job market data for relevant jobs
            job_matches = []
            for job_title in potential_jobs:
                market_analysis = self.job_analyzer.analyze_job_market(job_title)
                if 'error' not in market_analysis:
                    # Calculate match score based on required skills and experience
                    required_skills = set(market_analysis['required_skills'])
                    user_skills = set(technical_skills.keys())
                    skill_match = len(required_skills.intersection(user_skills)) / len(required_skills)
                    
                    # Weight experience more heavily for senior positions
                    experience_weight = 0.4 if 'senior' in job_title.lower() else 0.3
                    skill_weight = 1 - experience_weight
                    
                    # Calculate weighted score
                    match_score = (skill_match * skill_weight + 
                                 (resume_analysis['experience_years'] / market_analysis['required_experience']) * 
                                 experience_weight) * 100
                    
                    if match_score > 60:  # Only include jobs with >60% match
                        job_matches.append({
                            'title': job_title.replace('_', ' ').title(),
                            'matchScore': round(match_score, 1),
                            'requiredSkills': list(required_skills),
                            'salary': market_analysis['salary_range'],
                            'experienceRequired': market_analysis['required_experience']
                        })
            
            # Sort job matches by score
            job_matches.sort(key=lambda x: x['matchScore'], reverse=True)
            
            # Calculate missing critical skills based on job requirements
            missing_skills = []
            seen_skills = set()
            
            for job in job_matches[:3]:  # Consider top 3 matching jobs
                for skill in job['requiredSkills']:
                    if skill not in technical_skills and skill not in seen_skills:
                        skill_relevance = self.skill_analyzer.analyze_skill_relevance(
                            skill, job['title']
                        )
                        if skill_relevance['is_relevant']:
                            missing_skills.append({
                                'skill': skill,
                                'priority': 'High' if skill_relevance['relevance_score'] > 0.8 else 'Medium',
                                'relevance': round(skill_relevance['relevance_score'] * 100)
                            })
                            seen_skills.add(skill)
            
            # Sort missing skills by relevance
            missing_skills.sort(key=lambda x: x['relevance'], reverse=True)
            
            # Calculate scores based on actual resume content
            skill_match_score = self._calculate_skill_match_score(technical_skills, job_matches)
            experience_score = self._calculate_experience_score(resume_analysis['experience'])
            education_score = self._calculate_education_score(resume_analysis['education'])
            
            # Weight the scores based on job level
            weights = self._determine_score_weights(job_matches)
            overall_score = (
                skill_match_score * weights['skills'] +
                experience_score * weights['experience'] +
                education_score * weights['education']
            )
            
            return {
                'overallScore': round(overall_score),
                'skillsMatch': round(skill_match_score),
                'experience': round(experience_score),
                'education': round(education_score),
                'missingSkills': missing_skills[:5],  # Top 5 missing skills
                'recommendedJobs': job_matches[:5],  # Top 5 job matches
                'skillGaps': {
                    'technical': [
                        {
                            'category': skill,
                            'gap': round((1 - technical_skills.get(skill, 0)) * 100)
                        }
                        for skill in self._get_relevant_skill_categories(job_matches)
                        if skill not in technical_skills or technical_skills[skill] < 0.8
                    ],
                    'soft': [
                        {
                            'category': skill['name'],
                            'gap': round((1 - skill['confidence']) * 100)
                        }
                        for skill in extracted_skills['soft']
                        if skill['confidence'] < 0.8
                    ]
                }
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error analyzing resume: {str(e)}"
            )

    def _calculate_skill_match_score(self, technical_skills: Dict, job_matches: List) -> float:
        """Calculate skill match score based on job requirements"""
        if not job_matches:
            return 0
        
        total_score = 0
        for job in job_matches[:3]:  # Consider top 3 matching jobs
            required_skills = set(job['requiredSkills'])
            user_skills = set(technical_skills.keys())
            match_score = len(required_skills.intersection(user_skills)) / len(required_skills)
            total_score += match_score
        
        return (total_score / min(len(job_matches), 3)) * 100

    def _determine_score_weights(self, job_matches: List) -> Dict:
        """Determine score weights based on job requirements"""
        if not job_matches:
            return {'skills': 0.4, 'experience': 0.3, 'education': 0.3}
        
        # Adjust weights based on top matching job
        top_job = job_matches[0]
        if 'senior' in top_job['title'].lower():
            return {'skills': 0.35, 'experience': 0.45, 'education': 0.2}
        elif 'junior' in top_job['title'].lower():
            return {'skills': 0.5, 'experience': 0.2, 'education': 0.3}
        else:
            return {'skills': 0.4, 'experience': 0.3, 'education': 0.3}

    def _get_relevant_skill_categories(self, job_matches: List) -> List:
        """Get relevant skill categories based on job matches"""
        categories = set()
        for job in job_matches:
            for skill in job['requiredSkills']:
                category = self.skill_analyzer.get_skill_category(skill)
                if category:
                    categories.add(category)
        return list(categories)

    def _calculate_experience_score(self, experience_list: List[Dict]) -> float:
        """Calculate experience score based on extracted experience"""
        if not experience_list:
            return 0
        
        total_years = 0
        relevant_experience = 0
        
        for exp in experience_list:
            # Calculate years from period
            period = exp['period']
            if isinstance(period, tuple) and len(period) == 2:
                start, end = period
                if end.lower() == 'present':
                    end = '2024'  # Current year
                years = int(end) - int(start)
                total_years += years
                
                # Check if experience is relevant based on skills mentioned
                if exp['skills_mentioned']:
                    relevant_experience += years
        
        # Score based on years of experience and relevance
        years_score = min(total_years / 10, 1)  # Cap at 10 years
        relevance_score = relevant_experience / total_years if total_years > 0 else 0
        
        return (years_score * 0.6 + relevance_score * 0.4) * 100
    
    def _calculate_education_score(self, education_list: List[Dict]) -> float:
        """Calculate education score based on extracted education"""
        if not education_list:
            return 0
        
        # Score weights for different education levels
        level_scores = {
            'PhD': 1.0,
            "Master's": 0.9,
            "Bachelor's": 0.8,
            'Other': 0.6
        }
        
        # Get highest education level
        highest_level = max(
            (level_scores.get(edu['level'], 0) for edu in education_list),
            default=0
        )
        
        return highest_level * 100 