# Seed Data

This directory contains JSON files used to seed the database with initial data for development and testing purposes.

## Naming Convention

Each JSON file should be named after the corresponding model in the `models` directory. For example:

- `User.json` - Seed data for the User model
- `Skill.json` - Seed data for the Skill model
- `Course.json` - Seed data for the Course model

## Data Format

Each JSON file should contain an array of objects that match the schema of the corresponding model.

Example `User.json`:
```json
[
  {
    "email": "test@example.com",
    "name": "Test User",
    "role": "user"
  },
  {
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
]
```

## Usage

To seed the database with this data, run:

```bash
npm run seed
```

This will insert the seed data into the database if the corresponding collections are empty. 