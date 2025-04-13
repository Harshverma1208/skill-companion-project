import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline
import spacy
import joblib
import os

class SkillAnalyzer:
    def __init__(self):
        """Initialize the Skill Analyzer with necessary models and tools."""
        # Load spaCy model for NLP tasks
        self.nlp = spacy.load("en_core_web_sm")
        
        # Initialize BERT-based skill classifier
        self.skill_classifier = pipeline("zero-shot-classification")
        
        # Load pre-trained skill embeddings (would be trained separately)
        self.skill_embeddings = self._load_skill_embeddings()
        
        # Initialize TF-IDF vectorizer for skill description analysis
        self.tfidf = TfidfVectorizer(stop_words='english')

    def _load_skill_embeddings(self):
        """Load pre-trained skill embeddings from file."""
        model_path = os.path.join(os.path.dirname(__file__), 'models', 'skill_embeddings.joblib')
        try:
            return joblib.load(model_path)
        except:
            # Return empty embeddings if file doesn't exist
            return {}

    def analyze_skill_gap(self, user_skills, required_skills):
        """
        Analyze the gap between user's skills and required skills.
        
        Args:
            user_skills (dict): Dictionary of user's skills and their levels
            required_skills (dict): Dictionary of required skills and their levels
        
        Returns:
            dict: Analysis of skill gaps and recommendations
        """
        gaps = {}
        for skill, required_level in required_skills.items():
            user_level = user_skills.get(skill, 0)
            gap = max(0, required_level - user_level)
            
            if gap > 0:
                gaps[skill] = {
                    'current_level': user_level,
                    'required_level': required_level,
                    'gap': gap,
                    'priority': self._calculate_priority(gap, required_level)
                }
        
        return {
            'gaps': gaps,
            'total_gap_score': sum(g['gap'] for g in gaps.values()),
            'recommendations': self._generate_recommendations(gaps)
        }

    def _calculate_priority(self, gap, required_level):
        """Calculate priority level for a skill gap."""
        if gap >= 50:
            return 'Critical'
        elif gap >= 30:
            return 'High'
        elif gap >= 15:
            return 'Medium'
        return 'Low'

    def _generate_recommendations(self, gaps):
        """Generate learning recommendations based on skill gaps."""
        recommendations = []
        for skill, gap_info in gaps.items():
            if gap_info['priority'] in ['Critical', 'High']:
                recommendations.append({
                    'skill': skill,
                    'type': 'Immediate Learning',
                    'reason': f"Critical skill gap of {gap_info['gap']}%"
                })
            else:
                recommendations.append({
                    'skill': skill,
                    'type': 'Gradual Improvement',
                    'reason': f"Moderate skill gap of {gap_info['gap']}%"
                })
        return recommendations

    def predict_skill_growth(self, skill_name, timeframe_months=6):
        """
        Predict the expected growth of a skill's importance.
        
        Args:
            skill_name (str): Name of the skill
            timeframe_months (int): Number of months to predict ahead
        
        Returns:
            dict: Predicted growth metrics
        """
        # In a real implementation, this would use time series analysis
        # and market trend data to make predictions
        base_growth = np.random.normal(10, 2)  # Mock growth rate
        confidence = np.random.uniform(0.7, 0.9)  # Mock confidence score
        
        return {
            'skill': skill_name,
            'predicted_growth': base_growth,
            'confidence': confidence,
            'timeframe': timeframe_months
        }

    def analyze_skill_relevance(self, skill_name, job_role):
        """
        Analyze how relevant a skill is for a specific job role.
        
        Args:
            skill_name (str): Name of the skill
            job_role (str): Target job role
        
        Returns:
            dict: Relevance analysis
        """
        # Use zero-shot classification to determine relevance
        result = self.skill_classifier(
            skill_name,
            candidate_labels=[job_role, f"not_{job_role}"],
        )
        
        relevance_score = result['scores'][0]
        
        return {
            'skill': skill_name,
            'job_role': job_role,
            'relevance_score': relevance_score,
            'is_relevant': relevance_score > 0.6
        }

    def get_skill_prerequisites(self, skill_name):
        """
        Determine prerequisites for a given skill.
        
        Args:
            skill_name (str): Name of the skill
        
        Returns:
            list: List of prerequisite skills
        """
        # This would typically use a knowledge graph or skill taxonomy
        # Here's a simplified example
        skill_prerequisites = {
            'React': ['JavaScript', 'HTML', 'CSS'],
            'Machine Learning': ['Python', 'Statistics', 'Linear Algebra'],
            'Cloud Architecture': ['Networking', 'Security', 'Operating Systems']
        }
        
        return skill_prerequisites.get(skill_name, []) 