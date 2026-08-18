MATCH (j:Job {id: $jobId})-[:REQUIRES]->(s:Skill)<-[:HAS_SKILL]-(c:Candidate)
RETURN
    c.id AS candidateId,
    c.name AS candidateName,
    collect(s.name) AS matchingSkills,
    count(s) AS matchCount
ORDER BY matchCount DESC