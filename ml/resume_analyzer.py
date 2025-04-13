import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import json

class ResumeAnalyzer:
    def __init__(self):
        """Initialize the Resume Analyzer with NLP models and skill database."""
        # Load spaCy model for NLP tasks
        self.nlp = spacy.load("en_core_web_sm")
        
        # Initialize TF-IDF vectorizer for text analysis
        self.tfidf = TfidfVectorizer(stop_words='english')
        
        # Load skill database
        self.skill_database = self._load_skill_database()
        
        # Load job role requirements
        self.job_requirements = self._load_job_requirements()

    def _load_skill_database(self):
        """Load comprehensive skill database."""
        return {
            'technical_skills': {
                'programming_languages': [
                    'Python', 'Java', 'JavaScript', 'C++', 'Ruby', 'PHP',
                    'Swift', 'Kotlin', 'Go', 'Rust'
                ],
                'web_technologies': [
                    'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js',
                    'Django', 'Flask', 'Spring', 'Express.js'
                ],
                'databases': [
                    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
                    'Oracle', 'SQL Server', 'Cassandra'
                ],
                'cloud_platforms': [
                    'AWS', 'Azure', 'Google Cloud', 'Heroku', 'DigitalOcean',
                    'Kubernetes', 'Docker'
                ],
                'ai_ml': [
                    'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV',
                    'Natural Language Processing', 'Computer Vision'
                ]
            },
            'soft_skills': [
                'Communication', 'Leadership', 'Problem Solving',
                'Team Collaboration', 'Time Management', 'Critical Thinking',
                'Adaptability', 'Creativity'
            ],
            'certifications': [
                'AWS Certified', 'Google Certified', 'Microsoft Certified',
                'PMP', 'CISSP', 'CompTIA'
            ]
        }

    def _load_job_requirements(self):
        """Load job role requirements and expected skills."""
        return {
            'software_engineer': {
                'required_skills': [
                    'Python', 'Java', 'JavaScript', 'SQL',
                    'Data Structures', 'Algorithms'
                ],
                'preferred_skills': [
                    'React', 'Node.js', 'AWS', 'Docker'
                ],
                'experience': '3-5 years',
                'education': "Bachelor's in Computer Science or related field"
            },
            'data_scientist': {
                'required_skills': [
                    'Python', 'R', 'SQL', 'Machine Learning',
                    'Statistics', 'Data Visualization'
                ],
                'preferred_skills': [
                    'TensorFlow', 'PyTorch', 'Big Data',
                    'Cloud Platforms'
                ],
                'experience': '2-4 years',
                'education': "Master's in Data Science, Statistics, or related field"
            },
            'frontend_developer': {
                'required_skills': [
                    'HTML', 'CSS', 'JavaScript', 'React',
                    'Responsive Design'
                ],
                'preferred_skills': [
                    'TypeScript', 'Vue.js', 'UI/UX Design',
                    'Testing'
                ],
                'experience': '2-4 years',
                'education': "Bachelor's in Computer Science or related field"
            }
        }

    def analyze_resume(self, resume_text, target_role=None):
        """
        Analyze resume content and extract relevant information.
        
        Args:
            resume_text (str): The text content of the resume
            target_role (str, optional): Specific job role to analyze against
        
        Returns:
            dict: Analysis results including skills, experience, and recommendations
        """
        # Process resume text with spaCy
        doc = self.nlp(resume_text)
        
        # Extract information
        extracted_info = {
            'skills': self._extract_skills(doc),
            'experience': self._extract_experience(doc),
            'education': self._extract_education(doc),
            'certifications': self._extract_certifications(doc)
        }
        
        # If target role specified, analyze match
        if target_role:
            extracted_info['role_match'] = self._analyze_role_match(
                extracted_info,
                target_role
            )
        
        # Generate recommendations
        extracted_info['recommendations'] = self._generate_recommendations(
            extracted_info,
            target_role
        )
        
        return extracted_info

    def _extract_skills(self, doc):
        """Extract skills from resume text using NLP."""
        skills = {
            'technical': [],
            'soft': [],
            'other': []
        }
        
        # Extract skills using pattern matching and NLP
        text = doc.text.lower()
        
        # Check technical skills
        for category, skill_list in self.skill_database['technical_skills'].items():
            for skill in skill_list:
                if skill.lower() in text:
                    skills['technical'].append({
                        'name': skill,
                        'category': category,
                        'confidence': self._calculate_skill_confidence(doc, skill)
                    })
        
        # Check soft skills
        for skill in self.skill_database['soft_skills']:
            if skill.lower() in text:
                skills['soft'].append({
                    'name': skill,
                    'confidence': self._calculate_skill_confidence(doc, skill)
                })
        
        return skills

    def _calculate_skill_confidence(self, doc, skill):
        """Calculate confidence score for extracted skill."""
        # This would use more sophisticated methods in production
        # Here's a simple implementation
        skill_lower = skill.lower()
        mentions = len([token for token in doc if token.text.lower() == skill_lower])
        context_score = 0.7  # Base confidence
        
        if mentions > 1:
            context_score += 0.1  # Increase confidence for multiple mentions
        
        return min(0.95, context_score)  # Cap at 95% confidence

    def _extract_experience(self, doc):
        """Extract work experience information."""
        experience = []
        
        # Simple regex pattern for date ranges
        date_pattern = r'(\d{4})\s*-\s*(\d{4}|present)'
        
        # Find paragraphs that might contain experience
        for para in doc.sents:
            text = para.text
            dates = re.findall(date_pattern, text, re.IGNORECASE)
            
            if dates:
                experience.append({
                    'period': dates[0],
                    'description': text,
                    'skills_mentioned': self._extract_skills_from_text(text)
                })
        
        return experience

    def _extract_education(self, doc):
        """Extract education information."""
        education = []
        
        # Keywords for education detection
        edu_keywords = [
            'bachelor', 'master', 'phd', 'degree',
            'university', 'college', 'school'
        ]
        
        for sent in doc.sents:
            if any(keyword in sent.text.lower() for keyword in edu_keywords):
                education.append({
                    'description': sent.text,
                    'level': self._determine_education_level(sent.text)
                })
        
        return education

    def _determine_education_level(self, text):
        """Determine the level of education from text."""
        text = text.lower()
        if 'phd' in text or 'doctorate' in text:
            return 'PhD'
        elif 'master' in text:
            return "Master's"
        elif 'bachelor' in text:
            return "Bachelor's"
        else:
            return 'Other'

    def _extract_certifications(self, doc):
        """Extract certification information."""
        certifications = []
        
        for cert in self.skill_database['certifications']:
            if cert.lower() in doc.text.lower():
                certifications.append({
                    'name': cert,
                    'verified': False  # Would need external verification
                })
        
        return certifications

    def _analyze_role_match(self, extracted_info, target_role):
        """Analyze how well the resume matches a target role."""
        if target_role not in self.job_requirements:
            return {
                'error': 'Role requirements not found',
                'available_roles': list(self.job_requirements.keys())
            }
        
        requirements = self.job_requirements[target_role]
        
        # Extract all technical skills
        technical_skills = [
            skill['name'].lower()
            for skill in extracted_info['skills']['technical']
        ]
        
        # Calculate match percentages
        required_match = sum(
            1 for skill in requirements['required_skills']
            if skill.lower() in technical_skills
        ) / len(requirements['required_skills'])
        
        preferred_match = sum(
            1 for skill in requirements['preferred_skills']
            if skill.lower() in technical_skills
        ) / len(requirements['preferred_skills'])
        
        return {
            'overall_match': (required_match * 0.7 + preferred_match * 0.3) * 100,
            'required_skills_match': required_match * 100,
            'preferred_skills_match': preferred_match * 100,
            'missing_required_skills': [
                skill for skill in requirements['required_skills']
                if skill.lower() not in technical_skills
            ],
            'missing_preferred_skills': [
                skill for skill in requirements['preferred_skills']
                if skill.lower() not in technical_skills
            ]
        }

    def _generate_recommendations(self, extracted_info, target_role=None):
        """Generate recommendations based on analysis."""
        recommendations = []
        
        if target_role and 'role_match' in extracted_info:
            match_info = extracted_info['role_match']
            
            # Recommend based on missing skills
            if match_info['missing_required_skills']:
                recommendations.append({
                    'type': 'Critical Skills Gap',
                    'description': 'Focus on acquiring these required skills',
                    'skills': match_info['missing_required_skills']
                })
            
            if match_info['missing_preferred_skills']:
                recommendations.append({
                    'type': 'Skill Enhancement',
                    'description': 'Consider learning these preferred skills',
                    'skills': match_info['missing_preferred_skills']
                })
        
        # General recommendations
        if len(extracted_info['skills']['technical']) < 5:
            recommendations.append({
                'type': 'Skills Diversity',
                'description': 'Add more technical skills to your profile'
            })
        
        if not extracted_info['certifications']:
            recommendations.append({
                'type': 'Certifications',
                'description': 'Consider adding relevant certifications'
            })
        
        return recommendations

    def _extract_skills_from_text(self, text):
        """Extract skills mentioned in a specific text segment."""
        skills = []
        text_lower = text.lower()
        
        # Check all skills in database
        for category, skill_list in self.skill_database['technical_skills'].items():
            for skill in skill_list:
                if skill.lower() in text_lower:
                    skills.append(skill)
        
        return skills 