MATCH (c:Candidate {id: $candidateId})-[:CONNECTED_TO]->(connected:Candidate)-[:HAS_SKILL]->(s:Skill)
WHERE NOT (c)-[:HAS_SKILL]->(s)
RETURN
    connected.name AS connectedCandidate,
    collect(s.name) AS recommendedSkills
ORDER BY connectedCandidate