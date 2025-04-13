import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import PCA
import networkx as nx
from datetime import datetime
import logging

class FeatureEngineer:
    def __init__(self):
        self.tfidf = TfidfVectorizer(max_features=1000)
        self.pca = PCA(n_components=50)
        
        # Initialize logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def create_skill_embeddings(self, df):
        """
        Create skill embeddings using TF-IDF and dimensionality reduction
        """
        try:
            if 'skills' not in df.columns:
                return df
                
            # Convert skills list to string
            skill_texts = df['skills'].apply(lambda x: ' '.join(x) if isinstance(x, list) else '')
            
            # Create TF-IDF features
            skill_features = self.tfidf.fit_transform(skill_texts)
            
            # Reduce dimensionality
            skill_embeddings = self.pca.fit_transform(skill_features.toarray())
            
            # Add embeddings as new features
            for i in range(skill_embeddings.shape[1]):
                df[f'skill_embedding_{i}'] = skill_embeddings[:, i]
                
            return df
            
        except Exception as e:
            self.logger.error(f"Error in creating skill embeddings: {str(e)}")
            return df

    def create_skill_graph_features(self, df):
        """
        Create features based on skill relationships graph
        """
        try:
            if 'skills' not in df.columns:
                return df
                
            # Create skill co-occurrence graph
            G = nx.Graph()
            
            # Add edges based on skill co-occurrence
            for skills in df['skills']:
                if isinstance(skills, list) and len(skills) > 1:
                    for i in range(len(skills)):
                        for j in range(i + 1, len(skills)):
                            if G.has_edge(skills[i], skills[j]):
                                G[skills[i]][skills[j]]['weight'] += 1
                            else:
                                G.add_edge(skills[i], skills[j], weight=1)
            
            # Calculate centrality measures for each skill
            centrality_measures = {
                'degree': nx.degree_centrality(G),
                'betweenness': nx.betweenness_centrality(G),
                'eigenvector': nx.eigenvector_centrality(G, max_iter=1000)
            }
            
            # Create features based on skill centrality
            for measure, values in centrality_measures.items():
                df[f'skill_{measure}_centrality'] = df['skills'].apply(
                    lambda x: np.mean([values.get(skill, 0) for skill in x])
                    if isinstance(x, list) else 0
                )
                
            return df
            
        except Exception as e:
            self.logger.error(f"Error in creating skill graph features: {str(e)}")
            return df

    def create_temporal_features(self, df):
        """
        Create features based on temporal aspects of experience and skills
        """
        try:
            if 'experience' not in df.columns:
                return df
                
            current_year = datetime.now().year
            
            # Calculate experience timeline features
            df['career_span'] = df['experience'].apply(
                lambda x: self._calculate_career_span(x, current_year)
                if isinstance(x, list) else 0
            )
            
            df['avg_tenure'] = df['experience'].apply(
                lambda x: self._calculate_average_tenure(x)
                if isinstance(x, list) else 0
            )
            
            df['job_switch_frequency'] = df['experience'].apply(
                lambda x: self._calculate_job_switches(x)
                if isinstance(x, list) else 0
            )
            
            return df
            
        except Exception as e:
            self.logger.error(f"Error in creating temporal features: {str(e)}")
            return df

    def _calculate_career_span(self, experience_list, current_year):
        """
        Calculate total career span in years
        """
        if not experience_list:
            return 0
            
        start_years = []
        end_years = []
        
        for exp in experience_list:
            if isinstance(exp, dict):
                if 'start_year' in exp:
                    start_years.append(exp['start_year'])
                if 'end_year' in exp:
                    end_years.append(exp['end_year'])
                elif 'current' in exp and exp['current']:
                    end_years.append(current_year)
        
        if not start_years or not end_years:
            return 0
            
        return max(end_years) - min(start_years)

    def _calculate_average_tenure(self, experience_list):
        """
        Calculate average tenure per position
        """
        if not experience_list:
            return 0
            
        tenures = []
        current_year = datetime.now().year
        
        for exp in experience_list:
            if isinstance(exp, dict):
                start_year = exp.get('start_year')
                end_year = exp.get('end_year', current_year if exp.get('current') else None)
                
                if start_year and end_year:
                    tenures.append(end_year - start_year)
        
        return np.mean(tenures) if tenures else 0

    def _calculate_job_switches(self, experience_list):
        """
        Calculate frequency of job switches
        """
        if not experience_list:
            return 0
            
        career_span = self._calculate_career_span(
            experience_list,
            datetime.now().year
        )
        
        if career_span == 0:
            return 0
            
        return len(experience_list) / career_span

    def create_skill_interaction_features(self, df):
        """
        Create features based on skill interactions and combinations
        """
        try:
            if 'skills' not in df.columns:
                return df
                
            # Define skill categories
            skill_categories = {
                'frontend': {'react', 'angular', 'vue', 'html', 'css'},
                'backend': {'python', 'java', 'node', 'django', 'spring'},
                'database': {'sql', 'mongodb', 'postgresql'},
                'devops': {'docker', 'kubernetes', 'jenkins'},
                'ai_ml': {'machine learning', 'deep learning', 'nlp'}
            }
            
            # Calculate category coverage
            for category, skills in skill_categories.items():
                df[f'{category}_coverage'] = df['skills'].apply(
                    lambda x: len(set(x).intersection(skills)) / len(skills)
                    if isinstance(x, list) else 0
                )
            
            # Calculate cross-category skill ratio
            df['cross_category_ratio'] = df['skills'].apply(
                lambda x: self._calculate_cross_category_ratio(x, skill_categories)
                if isinstance(x, list) else 0
            )
            
            return df
            
        except Exception as e:
            self.logger.error(f"Error in creating skill interaction features: {str(e)}")
            return df

    def _calculate_cross_category_ratio(self, skills, categories):
        """
        Calculate the ratio of skills that appear in multiple categories
        """
        if not skills:
            return 0
            
        cross_category_skills = 0
        for skill in skills:
            categories_covered = sum(
                1 for cat_skills in categories.values()
                if skill.lower() in cat_skills
            )
            if categories_covered > 1:
                cross_category_skills += 1
                
        return cross_category_skills / len(skills) if skills else 0

    def create_advanced_features(self, df):
        """
        Create all advanced features
        """
        try:
            # Create skill embeddings
            df = self.create_skill_embeddings(df)
            
            # Create skill graph features
            df = self.create_skill_graph_features(df)
            
            # Create temporal features
            df = self.create_temporal_features(df)
            
            # Create skill interaction features
            df = self.create_skill_interaction_features(df)
            
            self.logger.info("Advanced feature engineering completed successfully")
            return df
            
        except Exception as e:
            self.logger.error(f"Error in advanced feature engineering: {str(e)}")
            return df 