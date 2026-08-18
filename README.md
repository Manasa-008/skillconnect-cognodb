# SkillConnect

SkillConnect is a small job and candidate matching application built with CognoDB.

The main idea is to use the relationships between jobs, candidates, skills, companies, and professional connections to make candidate matching easier.

# What the application does

- Shows available jobs
- Finds candidates who have skills required for a job
- Shows candidate details
- Shows a candidate's skills, experience, applied jobs, and companies
- Suggests new skills based on the candidate's professional connections

# Why did I use a graph database?

The main reason for choosing a graph database is the number of relationships in this application.

A candidate can have many skills, apply for different jobs, work at different companies, and be connected to other candidates.

For example, to find skills that could be useful to a candidate, the application can follow this relationship:

Candidate → CONNECTED_TO → Candidate → HAS_SKILL → Skill

This type of relationship is straightforward to represent and query in a graph database. In a relational database, the same operation would involve multiple tables and joins.

That made CognoDB a good fit for this use case.

# Data Model

The application uses four main types of nodes:

- Candidate
- Skill
- Job
- Company

The relationships are:

- Candidate → HAS_SKILL → Skill
- Job → REQUIRES → Skill
- Candidate → APPLIED_FOR → Job
- Candidate → WORKED_AT → Company
- Candidate → CONNECTED_TO → Candidate

# Graph structure

```text
Candidate ── HAS_SKILL ──> Skill

Job ── REQUIRES ──> Skill

Candidate ── APPLIED_FOR ──> Job

Candidate ── WORKED_AT ──> Company

Candidate ── CONNECTED_TO ──> Candidate
```

# Tech Used

## Backend:
Node.js
Express.js
JavaScript
Neo4j JavaScript Driver

## Database:
CognoDB
openCypher
Bolt

## Frontend:
HTML
CSS
JavaScript

# Project Structure

skillconnect-cognodb/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── queries/
│   ├── jobMatches.cypher
│   └── connectionRecommendations.cypher
│
├── .env
├── .gitignore
├── db.js
├── seed.js
├── server.js
├── package.json
└── README.md

How to Run
1. Clone the repository
git clone https://github.com/Manasa-008/skillconnect-cognodb.git
cd skillconnect-cognodb
2. Install the packages
npm install
3. Create a CognoDB instance

Create a free instance from CognoDB Cloud.

After creating the instance, save the connection URI and password.

The URI will look similar to:

bolt+s://<instance-id>.databases.cognodb.cloud
4. Create the .env file

Create a .env file in the project root:

COGNODB_URI=your_cognodb_uri
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your_cognodb_password
PORT=3000

The .env file should not be pushed to GitHub.

5. Load the sample data

Run:

node seed.js

This creates the sample candidates, jobs, skills, companies, and their relationships.

6. Start the server

Run:

node server.js

Then open:

http://localhost:3000
API Endpoints
Get Jobs
GET /api/jobs

Returns the available jobs.

Find Matching Candidates
GET /api/jobs/:jobId/matches

Example:

GET /api/jobs/J001/matches

This checks the skills required by the job and finds candidates who have those skills.

Get Candidate Details
GET /api/candidates/:candidateId

Example:

GET /api/candidates/C001

This returns the candidate's basic details, skills, applied jobs, and companies.

Get Skill Recommendations
GET /api/candidates/:candidateId/recommendations

Example:

GET /api/candidates/C001/recommendations

This looks at the candidate's connections and finds skills that they do not currently have.

Main Cypher Queries
Job Matching

The job matching query follows this relationship:

Job → REQUIRES → Skill ← HAS_SKILL ← Candidate

This is used to find candidates who have the skills required for a particular job.

The job ID is passed to the query as a parameter.

Skill Recommendations

The recommendation query uses more than one relationship:

Candidate
    ↓
CONNECTED_TO
    ↓
Candidate
    ↓
HAS_SKILL
    ↓
Skill

This allows the application to look at skills held by connected candidates and recommend skills that the current candidate does not already have.

Error Handling

The backend handles database and API errors and returns appropriate error responses.

The frontend also has:

Loading states
Empty states
Error messages

For example, if there are no matching candidates for a job, the application displays a message instead of showing an empty section.

Application Flow
Jobs
  ↓
Select a Job
  ↓
Find Matching Candidates
  ↓
View Candidate Profile
  ↓
View Recommended Skills