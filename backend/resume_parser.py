import pdfplumber
import docx
import re
import spacy
from typing import List, Dict, Optional
import json

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

# Common skills dataset
SKILLS_DATASET = {
    "programming_languages": [
        "python", "java", "javascript", "c++", "ruby", "php", "swift", "kotlin", "go",
        "typescript", "rust", "scala", "perl", "r", "matlab"
    ],
    "web_technologies": [
        "html", "css", "react", "angular", "vue", "node.js", "django", "flask",
        "spring", "express.js", "fastapi", "jquery", "bootstrap", "tailwind",
        "webpack", "redux", "graphql", "rest api"
    ],
    "databases": [
        "sql", "mysql", "postgresql", "mongodb", "oracle", "sqlite", "redis",
        "elasticsearch", "cassandra", "dynamodb", "firebase"
    ],
    "cloud_devops": [
        "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "terraform",
        "ansible", "circleci", "git", "github", "gitlab", "bitbucket"
    ],
    "ai_ml": [
        "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
        "scikit-learn", "pandas", "numpy", "opencv", "nlp", "computer vision",
        "neural networks", "data science", "artificial intelligence"
    ],
    "soft_skills": [
        "communication", "leadership", "teamwork", "problem solving",
        "project management", "time management", "analytical", "creativity",
        "attention to detail", "organization"
    ]
}

# Job role mapping based on skills
JOB_ROLES = {
    "Frontend Developer": {
        "required_skills": ["html", "css", "javascript"],
        "preferred_skills": ["react", "angular", "vue", "typescript", "webpack"]
    },
    "Backend Developer": {
        "required_skills": ["python", "java", "sql"],
        "preferred_skills": ["django", "flask", "spring", "node.js", "postgresql", "mongodb"]
    },
    "Full Stack Developer": {
        "required_skills": ["javascript", "html", "css", "python", "sql"],
        "preferred_skills": ["react", "node.js", "mongodb", "aws", "docker"]
    },
    "Data Scientist": {
        "required_skills": ["python", "machine learning", "sql"],
        "preferred_skills": ["tensorflow", "pytorch", "pandas", "numpy", "scikit-learn"]
    },
    "DevOps Engineer": {
        "required_skills": ["linux", "docker", "aws"],
        "preferred_skills": ["kubernetes", "terraform", "jenkins", "ansible", "ci/cd"]
    },
    "ML Engineer": {
        "required_skills": ["python", "machine learning", "deep learning"],
        "preferred_skills": ["tensorflow", "pytorch", "keras", "computer vision", "nlp"]
    }
}

class ResumeParser:
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        """Extract text from PDF file"""
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error extracting text from PDF: {str(e)}")
        return text

    @staticmethod
    def extract_text_from_docx(file_path: str) -> str:
        """Extract text from DOCX file"""
        text = ""
        try:
            doc = docx.Document(file_path)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        except Exception as e:
            print(f"Error extracting text from DOCX: {str(e)}")
        return text

    @staticmethod
    def extract_email(text: str) -> Optional[str]:
        """Extract email address from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(email_pattern, text)
        return match.group(0) if match else None

    @staticmethod
    def extract_phone(text: str) -> Optional[str]:
        """Extract phone number from text"""
        phone_pattern = r'(\+\d{1,3}[-.]?)?\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
        match = re.search(phone_pattern, text)
        return match.group(0) if match else None

    @staticmethod
    def extract_name(text: str) -> Optional[str]:
        """Extract name from text using spaCy NER"""
        doc = nlp(text[:1000])  # Process first 1000 chars for efficiency
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                return ent.text
        return None

    @staticmethod
    def extract_skills(text: str) -> Dict[str, List[str]]:
        """Extract skills from text"""
        text = text.lower()
        found_skills = {category: [] for category in SKILLS_DATASET.keys()}
        
        for category, skills in SKILLS_DATASET.items():
            for skill in skills:
                if re.search(r'\b' + re.escape(skill) + r'\b', text):
                    found_skills[category].append(skill)
        
        return found_skills

    @staticmethod
    def suggest_job_roles(skills: Dict[str, List[str]]) -> List[Dict[str, float]]:
        """Suggest job roles based on extracted skills"""
        # Flatten skills list
        all_skills = [skill.lower() for sublist in skills.values() for skill in sublist]
        
        role_scores = []
        for role, requirements in JOB_ROLES.items():
            score = 0
            total_required = len(requirements["required_skills"])
            total_preferred = len(requirements["preferred_skills"])
            
            # Check required skills
            for skill in requirements["required_skills"]:
                if skill in all_skills:
                    score += 1
            
            # Check preferred skills
            for skill in requirements["preferred_skills"]:
                if skill in all_skills:
                    score += 0.5
            
            # Calculate percentage match
            max_score = total_required + (total_preferred * 0.5)
            percentage_match = (score / max_score) * 100 if max_score > 0 else 0
            
            if percentage_match >= 30:  # Only include roles with at least 30% match
                role_scores.append({
                    "role": role,
                    "match_percentage": round(percentage_match, 2)
                })
        
        # Sort by match percentage
        return sorted(role_scores, key=lambda x: x["match_percentage"], reverse=True)

    def parse_resume(self, file_path: str, file_type: str) -> Dict:
        """Main method to parse resume and extract information"""
        # Extract text based on file type
        text = ""
        if file_type == "pdf":
            text = self.extract_text_from_pdf(file_path)
        elif file_type == "docx":
            text = self.extract_text_from_docx(file_path)
        
        if not text:
            return {"error": "Could not extract text from file"}
        
        # Extract information
        email = self.extract_email(text)
        phone = self.extract_phone(text)
        name = self.extract_name(text)
        skills = self.extract_skills(text)
        suggested_roles = self.suggest_job_roles(skills)
        
        return {
            "name": name,
            "email": email,
            "phone": phone,
            "skills": skills,
            "suggested_roles": suggested_roles[:3]  # Return top 3 matching roles
        } 