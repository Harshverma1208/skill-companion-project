"""
ML Package for Skill Companion
This package contains all the machine learning components for skill analysis,
job market predictions, and course recommendations.
"""

from .skill_analyzer import SkillAnalyzer
from .job_analyzer import JobAnalyzer
from .course_recommender import CourseRecommender
from .resume_analyzer import ResumeAnalyzer

__version__ = '1.0.0'
__all__ = ['SkillAnalyzer', 'JobAnalyzer', 'CourseRecommender', 'ResumeAnalyzer'] 