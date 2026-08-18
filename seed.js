const driver = require("./db");

const session = driver.session();

async function seedDatabase() {
    try {
        await session.run(`
            MATCH (n)
            DETACH DELETE n
        `);

        await session.run(`
            CREATE
            (c1:Candidate {id: "C001", name: "Manasa", email: "manasa@example.com", location: "Hyderabad", experience: 2}),
            (c2:Candidate {id: "C002", name: "Yaswanth", email: "yaswanth@example.com", location: "Bangalore", experience: 3}),
            (c3:Candidate {id: "C003", name: "Nani", email: "nani@example.com", location: "Hyderabad", experience: 1}),
            (c4:Candidate {id: "C004", name: "Tara", email: "tara@example.com", location: "Chennai", experience: 4}),

            (s1:Skill {id: "S001", name: "Java", category: "Backend"}),
            (s2:Skill {id: "S002", name: "JavaScript", category: "Frontend"}),
            (s3:Skill {id: "S003", name: "React", category: "Frontend"}),
            (s4:Skill {id: "S004", name: "Node.js", category: "Backend"}),
            (s5:Skill {id: "S005", name: "SQL", category: "Database"}),
            (s6:Skill {id: "S006", name: "Python", category: "Programming"}),
            (s7:Skill {id: "S007", name: "Machine Learning", category: "AI"}),

            (j1:Job {id: "J001", title: "Java Backend Developer", location: "Hyderabad", experienceRequired: 1}),
            (j2:Job {id: "J002", title: "Full Stack Developer", location: "Bangalore", experienceRequired: 2}),
            (j3:Job {id: "J003", title: "AI/ML Engineer", location: "Hyderabad", experienceRequired: 1}),

            (co1:Company {id: "CO001", name: "TechNova", industry: "Software"}),
            (co2:Company {id: "CO002", name: "DataSphere", industry: "Artificial Intelligence"})
        `);

        await session.run(`
            MATCH
            (c1:Candidate {id: "C001"}),
            (c2:Candidate {id: "C002"}),
            (c3:Candidate {id: "C003"}),
            (c4:Candidate {id: "C004"}),
            (s1:Skill {id: "S001"}),
            (s2:Skill {id: "S002"}),
            (s3:Skill {id: "S003"}),
            (s4:Skill {id: "S004"}),
            (s5:Skill {id: "S005"}),
            (s6:Skill {id: "S006"}),
            (s7:Skill {id: "S007"}),
            (j1:Job {id: "J001"}),
            (j2:Job {id: "J002"}),
            (j3:Job {id: "J003"}),
            (co1:Company {id: "CO001"}),
            (co2:Company {id: "CO002"})

            CREATE
            (c1)-[:HAS_SKILL]->(s1),
            (c1)-[:HAS_SKILL]->(s2),
            (c1)-[:HAS_SKILL]->(s5),

            (c2)-[:HAS_SKILL]->(s2),
            (c2)-[:HAS_SKILL]->(s3),
            (c2)-[:HAS_SKILL]->(s4),

            (c3)-[:HAS_SKILL]->(s1),
            (c3)-[:HAS_SKILL]->(s6),
            (c3)-[:HAS_SKILL]->(s7),

            (c4)-[:HAS_SKILL]->(s1),
            (c4)-[:HAS_SKILL]->(s4),
            (c4)-[:HAS_SKILL]->(s5),

            (j1)-[:REQUIRES]->(s1),
            (j1)-[:REQUIRES]->(s5),

            (j2)-[:REQUIRES]->(s2),
            (j2)-[:REQUIRES]->(s3),
            (j2)-[:REQUIRES]->(s4),

            (j3)-[:REQUIRES]->(s6),
            (j3)-[:REQUIRES]->(s7),

            (c1)-[:APPLIED_FOR]->(j1),
            (c2)-[:APPLIED_FOR]->(j2),
            (c3)-[:APPLIED_FOR]->(j3),
            (c4)-[:APPLIED_FOR]->(j1),

            (c1)-[:WORKED_AT]->(co1),
            (c2)-[:WORKED_AT]->(co1),
            (c3)-[:WORKED_AT]->(co2),
            (c4)-[:WORKED_AT]->(co2),

            (c1)-[:CONNECTED_TO]->(c2),
            (c2)-[:CONNECTED_TO]->(c3),
            (c3)-[:CONNECTED_TO]->(c4)
        `);

        console.log("SkillConnect database seeded successfully");
    } catch (error) {
        console.error("Seed failed:", error.message);
    } finally {
        await session.close();
        await driver.close();
    }
}

seedDatabase();