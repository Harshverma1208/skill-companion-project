import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re
import logging

class DataPreprocessor:
    def __init__(self):
        self.label_encoders = {}
        self.scaler = MinMaxScaler()
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        
        # Initialize logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def clean_text_data(self, text):
        """
        Clean and normalize text data from resumes and job descriptions
        """
        if not isinstance(text, str):
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and numbers
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Tokenization
        tokens = word_tokenize(text)
        
        # Remove stop words and lemmatize
        cleaned_tokens = [
            self.lemmatizer.lemmatize(token)
            for token in tokens
            if token not in self.stop_words
        ]
        
        return ' '.join(cleaned_tokens)

    def extract_skills(self, text):
        """
        Extract skills from text using predefined skill patterns and keywords
        """
        # Common technical skills patterns
        tech_patterns = [
            r'python|java|javascript|react|node\.js|sql|aws|docker|kubernetes|git',
            r'machine learning|deep learning|artificial intelligence|data science',
            r'html5|css3|angular|vue\.js|typescript|mongodb|postgresql'
        ]
        
        # Common soft skills patterns
        soft_patterns = [
            r'communication|leadership|teamwork|problem solving|analytical',
            r'project management|time management|critical thinking|collaboration'
        ]
        
        skills = []
        text = text.lower()
        
        # Extract technical skills
        for pattern in tech_patterns:
            matches = re.findall(pattern, text)
            skills.extend(matches)
            
        # Extract soft skills
        for pattern in soft_patterns:
            matches = re.findall(pattern, text)
            skills.extend(matches)
            
        return list(set(skills))

    def clean_numerical_data(self, df, columns):
        """
        Clean numerical data by handling missing values and outliers
        """
        for col in columns:
            if col in df.columns:
                # Handle missing values
                df[col] = pd.to_numeric(df[col], errors='coerce')
                median_value = df[col].median()
                df[col].fillna(median_value, inplace=True)
                
                # Handle outliers using IQR method
                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                df[col] = df[col].clip(lower_bound, upper_bound)
                
        return df

    def encode_categorical_features(self, df, columns):
        """
        Encode categorical features using Label Encoding
        """
        for col in columns:
            if col in df.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                
                # Handle missing values
                df[col].fillna('Unknown', inplace=True)
                
                # Fit and transform the data
                df[col] = self.label_encoders[col].fit_transform(df[col])
                
        return df

    def create_skill_features(self, df):
        """
        Create features from skill data
        """
        # Skill count features
        df['total_skills'] = df['skills'].apply(len)
        df['technical_skills_count'] = df['skills'].apply(
            lambda x: sum(1 for skill in x if self.is_technical_skill(skill))
        )
        df['soft_skills_count'] = df['skills'].apply(
            lambda x: sum(1 for skill in x if self.is_soft_skill(skill))
        )
        
        # Skill diversity score
        df['skill_diversity'] = df['skills'].apply(self.calculate_skill_diversity)
        
        # Skill relevance score
        df['skill_relevance'] = df.apply(self.calculate_skill_relevance, axis=1)
        
        return df

    def is_technical_skill(self, skill):
        """
        Determine if a skill is technical
        """
        technical_keywords = {
            'programming', 'development', 'software', 'engineering', 'database',
            'cloud', 'api', 'framework', 'language', 'tool', 'technology'
        }
        return any(keyword in skill.lower() for keyword in technical_keywords)

    def is_soft_skill(self, skill):
        """
        Determine if a skill is a soft skill
        """
        soft_keywords = {
            'communication', 'leadership', 'management', 'teamwork', 'problem solving',
            'analytical', 'interpersonal', 'organization', 'creativity'
        }
        return any(keyword in skill.lower() for keyword in soft_keywords)

    def calculate_skill_diversity(self, skills):
        """
        Calculate skill diversity score based on skill categories
        """
        categories = {
            'frontend': {'react', 'angular', 'vue', 'html', 'css', 'javascript'},
            'backend': {'python', 'java', 'node', 'php', 'ruby', 'golang'},
            'database': {'sql', 'mongodb', 'postgresql', 'mysql', 'oracle'},
            'devops': {'docker', 'kubernetes', 'jenkins', 'aws', 'azure', 'gcp'},
            'ai_ml': {'machine learning', 'deep learning', 'nlp', 'computer vision'}
        }
        
        covered_categories = sum(
            1 for cat_skills in categories.values()
            if any(skill.lower() in cat_skills for skill in skills)
        )
        
        return covered_categories / len(categories)

    def calculate_skill_relevance(self, row):
        """
        Calculate skill relevance score based on job requirements
        """
        if 'required_skills' not in row or 'skills' not in row:
            return 0.0
            
        required_skills = set(skill.lower() for skill in row['required_skills'])
        user_skills = set(skill.lower() for skill in row['skills'])
        
        if not required_skills:
            return 0.0
            
        return len(required_skills.intersection(user_skills)) / len(required_skills)

    def normalize_features(self, df, columns):
        """
        Normalize numerical features using Min-Max scaling
        """
        df[columns] = self.scaler.fit_transform(df[columns])
        return df

    def create_experience_features(self, df):
        """
        Create features from experience data
        """
        if 'experience' not in df.columns:
            return df
            
        # Extract years of experience
        df['total_years'] = df['experience'].apply(self.extract_years_of_experience)
        
        # Create experience recency feature
        df['experience_recency'] = df['experience'].apply(self.calculate_experience_recency)
        
        # Create role progression feature
        df['role_progression'] = df['experience'].apply(self.calculate_role_progression)
        
        return df

    def extract_years_of_experience(self, experience_list):
        """
        Extract total years of experience from experience entries
        """
        if not isinstance(experience_list, list):
            return 0
            
        total_years = 0
        for exp in experience_list:
            if 'duration' in exp:
                # Convert duration to years
                duration = exp['duration'].lower()
                if 'year' in duration:
                    years = float(re.findall(r'\d+', duration)[0])
                    total_years += years
                elif 'month' in duration:
                    months = float(re.findall(r'\d+', duration)[0])
                    total_years += months / 12
                    
        return total_years

    def calculate_experience_recency(self, experience_list):
        """
        Calculate experience recency score
        """
        if not isinstance(experience_list, list) or not experience_list:
            return 0
            
        current_year = pd.Timestamp.now().year
        most_recent = max(
            exp.get('end_year', current_year)
            for exp in experience_list
            if isinstance(exp, dict)
        )
        
        # Calculate recency score (1.0 for current, decreasing for older experience)
        recency_score = 1.0 - (current_year - most_recent) * 0.1
        return max(0, recency_score)

    def calculate_role_progression(self, experience_list):
        """
        Calculate career progression score based on role levels
        """
        if not isinstance(experience_list, list) or not experience_list:
            return 0
            
        role_levels = {
            'intern': 1,
            'junior': 2,
            'associate': 3,
            'senior': 4,
            'lead': 5,
            'manager': 5,
            'director': 6,
            'vp': 7,
            'chief': 8
        }
        
        # Extract role levels from experience
        levels = []
        for exp in experience_list:
            if isinstance(exp, dict) and 'title' in exp:
                title = exp['title'].lower()
                for role, level in role_levels.items():
                    if role in title:
                        levels.append(level)
                        break
                        
        if not levels:
            return 0
            
        # Calculate progression score
        return (max(levels) - min(levels)) / len(levels) if len(levels) > 1 else 0

    def process_dataset(self, df):
        """
        Complete data processing pipeline
        """
        try:
            # Clean text data
            text_columns = ['description', 'requirements']
            for col in text_columns:
                if col in df.columns:
                    df[col] = df[col].apply(self.clean_text_data)
            
            # Extract skills
            if 'description' in df.columns:
                df['extracted_skills'] = df['description'].apply(self.extract_skills)
            
            # Clean numerical data
            numerical_columns = ['years_of_experience', 'salary']
            df = self.clean_numerical_data(df, numerical_columns)
            
            # Encode categorical features
            categorical_columns = ['job_category', 'seniority_level', 'employment_type']
            df = self.encode_categorical_features(df, categorical_columns)
            
            # Create skill features
            if 'skills' in df.columns:
                df = self.create_skill_features(df)
            
            # Create experience features
            if 'experience' in df.columns:
                df = self.create_experience_features(df)
            
            # Normalize numerical features
            numerical_features = ['total_skills', 'skill_diversity', 'skill_relevance',
                                'total_years', 'experience_recency', 'role_progression']
            df = self.normalize_features(df, [col for col in numerical_features if col in df.columns])
            
            self.logger.info("Data preprocessing completed successfully")
            return df
            
        except Exception as e:
            self.logger.error(f"Error in data preprocessing: {str(e)}")
            raise 