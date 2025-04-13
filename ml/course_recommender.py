import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime
import json

class CourseRecommender:
    def __init__(self):
        """Initialize the Course Recommender with course data and models."""
        self.courses = self._load_course_data()
        self.learning_paths = self._load_learning_paths()

    def _load_course_data(self):
        """Load course database."""
        # In a real implementation, this would load from a database
        return {
            'web_development': [
                {
                    'id': 'WD001',
                    'title': 'Complete React Developer',
                    'platform': 'Udemy',
                    'skills': ['React', 'Redux', 'JavaScript'],
                    'level': 'Intermediate',
                    'duration': '40 hours',
                    'rating': 4.7,
                    'enrolled': 150000,
                    'price': 89.99
                },
                {
                    'id': 'WD002',
                    'title': 'Node.js: The Complete Guide',
                    'platform': 'Coursera',
                    'skills': ['Node.js', 'Express', 'MongoDB'],
                    'level': 'Intermediate',
                    'duration': '32 hours',
                    'rating': 4.8,
                    'enrolled': 120000,
                    'price': 79.99
                }
            ],
            'data_science': [
                {
                    'id': 'DS001',
                    'title': 'Data Science Specialization',
                    'platform': 'Coursera',
                    'skills': ['Python', 'Statistics', 'Machine Learning'],
                    'level': 'Advanced',
                    'duration': '120 hours',
                    'rating': 4.9,
                    'enrolled': 200000,
                    'price': 399.99
                }
            ],
            'cloud_computing': [
                {
                    'id': 'CC001',
                    'title': 'AWS Certified Solutions Architect',
                    'platform': 'AWS Training',
                    'skills': ['AWS', 'Cloud Architecture', 'Security'],
                    'level': 'Advanced',
                    'duration': '60 hours',
                    'rating': 4.8,
                    'enrolled': 180000,
                    'price': 149.99
                }
            ]
        }

    def _load_learning_paths(self):
        """Load predefined learning paths."""
        return {
            'frontend_developer': {
                'name': 'Frontend Developer Path',
                'duration': '6 months',
                'skills': ['HTML', 'CSS', 'JavaScript', 'React'],
                'courses': ['WD001'],
                'prerequisites': ['Basic programming knowledge']
            },
            'fullstack_developer': {
                'name': 'Full Stack Developer Path',
                'duration': '12 months',
                'skills': ['React', 'Node.js', 'MongoDB', 'AWS'],
                'courses': ['WD001', 'WD002', 'CC001'],
                'prerequisites': ['JavaScript fundamentals']
            },
            'data_scientist': {
                'name': 'Data Scientist Path',
                'duration': '9 months',
                'skills': ['Python', 'Statistics', 'Machine Learning'],
                'courses': ['DS001'],
                'prerequisites': ['Basic Python', 'Mathematics']
            }
        }

    def recommend_courses(self, user_skills, target_skills, preferences=None):
        """
        Recommend courses based on skill gaps and user preferences.
        
        Args:
            user_skills (dict): Current skill levels of the user
            target_skills (dict): Target skill levels to achieve
            preferences (dict, optional): User preferences for courses
        
        Returns:
            list: Recommended courses with relevance scores
        """
        skill_gaps = self._calculate_skill_gaps(user_skills, target_skills)
        recommendations = []
        
        for category, courses in self.courses.items():
            for course in courses:
                relevance_score = self._calculate_course_relevance(
                    course, skill_gaps, preferences
                )
                if relevance_score > 0.5:  # Minimum relevance threshold
                    recommendations.append({
                        **course,
                        'relevance_score': relevance_score,
                        'skills_covered': self._get_skills_covered(course, skill_gaps)
                    })
        
        # Sort by relevance score
        recommendations.sort(key=lambda x: x['relevance_score'], reverse=True)
        return recommendations[:5]  # Return top 5 recommendations

    def _calculate_skill_gaps(self, user_skills, target_skills):
        """Calculate the gap between current and target skills."""
        gaps = {}
        for skill, target_level in target_skills.items():
            current_level = user_skills.get(skill, 0)
            if current_level < target_level:
                gaps[skill] = {
                    'current': current_level,
                    'target': target_level,
                    'gap': target_level - current_level
                }
        return gaps

    def _calculate_course_relevance(self, course, skill_gaps, preferences=None):
        """Calculate how relevant a course is based on skill gaps and preferences."""
        relevance_score = 0
        total_weight = 0
        
        # Check skill coverage
        for skill in course['skills']:
            if skill in skill_gaps:
                gap = skill_gaps[skill]['gap']
                weight = 1.0
                if preferences and 'priority_skills' in preferences:
                    weight = 2.0 if skill in preferences['priority_skills'] else 1.0
                
                relevance_score += (gap / 100) * weight
                total_weight += weight
        
        # Adjust for preferences if provided
        if preferences:
            if 'max_duration' in preferences:
                duration_hours = float(course['duration'].split()[0])
                if duration_hours > preferences['max_duration']:
                    relevance_score *= 0.8
            
            if 'max_price' in preferences:
                if course['price'] > preferences['max_price']:
                    relevance_score *= 0.7
            
            if 'preferred_platforms' in preferences:
                if course['platform'] in preferences['preferred_platforms']:
                    relevance_score *= 1.2
        
        return relevance_score / total_weight if total_weight > 0 else 0

    def _get_skills_covered(self, course, skill_gaps):
        """Get the list of gap skills covered by the course."""
        return [skill for skill in course['skills'] if skill in skill_gaps]

    def suggest_learning_path(self, career_goal, current_skills=None):
        """
        Suggest a learning path based on career goal.
        
        Args:
            career_goal (str): Target career path
            current_skills (dict, optional): Current skill levels
        
        Returns:
            dict: Recommended learning path with courses
        """
        if career_goal not in self.learning_paths:
            return {
                'error': 'Career path not found',
                'available_paths': list(self.learning_paths.keys())
            }
            
        path = self.learning_paths[career_goal]
        
        # If current skills provided, customize the path
        if current_skills:
            path = self._customize_learning_path(path, current_skills)
            
        return {
            'path_name': path['name'],
            'duration': path['duration'],
            'required_skills': path['skills'],
            'prerequisites': path['prerequisites'],
            'courses': [
                self._get_course_by_id(course_id)
                for course_id in path['courses']
            ]
        }

    def _customize_learning_path(self, path, current_skills):
        """Customize learning path based on current skills."""
        customized_path = path.copy()
        
        # Remove courses for skills the user already has
        customized_path['courses'] = [
            course_id for course_id in path['courses']
            if not self._skills_already_mastered(
                self._get_course_by_id(course_id)['skills'],
                current_skills
            )
        ]
        
        # Adjust duration based on remaining courses
        original_duration = int(path['duration'].split()[0])
        remaining_ratio = len(customized_path['courses']) / len(path['courses'])
        customized_path['duration'] = f"{int(original_duration * remaining_ratio)} months"
        
        return customized_path

    def _skills_already_mastered(self, course_skills, current_skills):
        """Check if all skills in a course are already mastered."""
        return all(
            current_skills.get(skill, 0) >= 80  # Assuming 80% is mastery
            for skill in course_skills
        )

    def _get_course_by_id(self, course_id):
        """Retrieve course details by ID."""
        for category in self.courses.values():
            for course in category:
                if course['id'] == course_id:
                    return course
        return None 