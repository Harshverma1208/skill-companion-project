import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import KMeans
from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup
import json

class JobAnalyzer:
    def __init__(self):
        """Initialize the Job Analyzer with necessary components."""
        self.scaler = MinMaxScaler()
        self.job_clusters = KMeans(n_clusters=5)
        self.market_data = self._load_market_data()

    def _load_market_data(self):
        """Load and prepare market data for analysis."""
        # In a real implementation, this would load from a database
        return {
            'tech_roles': {
                'Full Stack Developer': {'demand': 85, 'growth': 12, 'salary_range': (80000, 150000)},
                'Data Scientist': {'demand': 90, 'growth': 15, 'salary_range': (90000, 160000)},
                'DevOps Engineer': {'demand': 88, 'growth': 14, 'salary_range': (95000, 165000)},
                'ML Engineer': {'demand': 92, 'growth': 18, 'salary_range': (100000, 180000)},
                'Cloud Architect': {'demand': 87, 'growth': 13, 'salary_range': (110000, 190000)}
            }
        }

    def analyze_job_market(self, job_title):
        """
        Analyze current job market conditions for a specific role.
        
        Args:
            job_title (str): The job title to analyze
        
        Returns:
            dict: Market analysis results
        """
        if job_title not in self.market_data['tech_roles']:
            return {
                'error': 'Job title not found in database',
                'similar_roles': self._find_similar_roles(job_title)
            }

        role_data = self.market_data['tech_roles'][job_title]
        
        return {
            'job_title': job_title,
            'market_demand': role_data['demand'],
            'growth_rate': role_data['growth'],
            'salary_range': role_data['salary_range'],
            'market_health': self._calculate_market_health(role_data),
            'future_outlook': self._predict_future_outlook(role_data)
        }

    def _calculate_market_health(self, role_data):
        """Calculate overall market health score."""
        demand_weight = 0.4
        growth_weight = 0.3
        salary_weight = 0.3
        
        demand_score = role_data['demand'] / 100
        growth_score = role_data['growth'] / 20  # Normalize assuming 20% is max growth
        salary_score = (role_data['salary_range'][1] - 80000) / 120000  # Normalize salary range
        
        health_score = (demand_score * demand_weight +
                       growth_score * growth_weight +
                       salary_score * salary_weight)
        
        return {
            'score': round(health_score * 100, 2),
            'status': self._get_health_status(health_score)
        }

    def _get_health_status(self, score):
        """Convert health score to status."""
        if score >= 0.8:
            return 'Excellent'
        elif score >= 0.6:
            return 'Good'
        elif score >= 0.4:
            return 'Moderate'
        else:
            return 'Challenging'

    def _predict_future_outlook(self, role_data):
        """Predict future market conditions."""
        current_demand = role_data['demand']
        growth_rate = role_data['growth']
        
        # Simple linear projection
        six_month_demand = current_demand * (1 + (growth_rate/100/2))
        one_year_demand = current_demand * (1 + (growth_rate/100))
        
        return {
            'six_month_outlook': {
                'projected_demand': round(six_month_demand, 2),
                'confidence': 0.85
            },
            'one_year_outlook': {
                'projected_demand': round(one_year_demand, 2),
                'confidence': 0.75
            }
        }

    def _find_similar_roles(self, job_title):
        """Find similar job titles in the database."""
        # In a real implementation, this would use NLP similarity
        similar_roles = []
        for role in self.market_data['tech_roles'].keys():
            if any(word.lower() in role.lower() for word in job_title.split()):
                similar_roles.append(role)
        return similar_roles

    def get_industry_distribution(self):
        """Get distribution of jobs across industries."""
        return {
            'Technology': 35,
            'Finance': 25,
            'Healthcare': 15,
            'E-commerce': 12,
            'Manufacturing': 8,
            'Education': 5
        }

    def get_remote_work_trends(self):
        """Analyze remote work trends."""
        return {
            'fully_remote': 45,
            'hybrid': 35,
            'office_based': 20,
            'trend': 'increasing',
            'year_over_year_change': 15
        }

    def analyze_salary_trends(self, job_title, location=None):
        """
        Analyze salary trends for a specific role.
        
        Args:
            job_title (str): The job title to analyze
            location (str, optional): Specific location for salary data
        
        Returns:
            dict: Salary trend analysis
        """
        if job_title not in self.market_data['tech_roles']:
            return {'error': 'Job title not found'}
            
        base_salary_range = self.market_data['tech_roles'][job_title]['salary_range']
        
        # Apply location adjustment if provided
        if location:
            location_multiplier = self._get_location_multiplier(location)
            adjusted_range = (
                base_salary_range[0] * location_multiplier,
                base_salary_range[1] * location_multiplier
            )
        else:
            adjusted_range = base_salary_range
            
        return {
            'salary_range': adjusted_range,
            'median': sum(adjusted_range) / 2,
            'percentiles': {
                '25th': adjusted_range[0],
                '50th': sum(adjusted_range) / 2,
                '75th': adjusted_range[1]
            },
            'factors': self._get_salary_factors(job_title)
        }

    def _get_location_multiplier(self, location):
        """Get salary multiplier based on location."""
        # This would typically come from a cost-of-living database
        multipliers = {
            'San Francisco': 1.5,
            'New York': 1.4,
            'Seattle': 1.3,
            'Austin': 1.1,
            'Remote': 1.0
        }
        return multipliers.get(location, 1.0)

    def _get_salary_factors(self, job_title):
        """Get factors affecting salary for a role."""
        return {
            'experience': 'High impact: 10-20% increase per year of experience',
            'skills': ['Technical expertise', 'Leadership', 'Domain knowledge'],
            'certifications': ['Role-specific certifications can increase salary by 5-15%'],
            'company_size': 'Larger companies typically offer 10-30% higher salaries'
        } 