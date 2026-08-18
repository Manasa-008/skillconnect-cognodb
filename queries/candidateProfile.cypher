MATCH (c:Candidate {id: $candidateId})
OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
OPTIONAL MATCH (c)-[:APPLIED_FOR]->(j:Job)
OPTIONAL MATCH (c)-[:WORKED_AT]->(co:Company)
RETURN
    c.id AS candidateId,
    c.name AS candidateName,
    c.email AS email,
    c.location AS location,
    c.experience AS experience,
    collect(DISTINCT s.name) AS skills,
    collect(DISTINCT j.title) AS appliedJobs,
    collect(DISTINCT co.name) AS companies