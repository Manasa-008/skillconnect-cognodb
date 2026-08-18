const express = require("express");
const cors = require("cors");
require("dotenv").config();

const driver = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("frontend"));

app.get("/", (req, res) => {
    res.json({ message: "SkillConnect API is running" });
});

app.get("/test-db", async (req, res) => {
    try {
        const session = driver.session();
        const result = await session.run("RETURN 'CognоDB connected successfully' AS message");
        await session.close();

        res.json({ message: result.records[0].get("message") });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/jobs", async (req, res) => {
    const session = driver.session();

    try {
        const result = await session.run(`
            MATCH (j:Job)
            RETURN
                j.id AS id,
                j.title AS title,
                j.location AS location,
                j.experienceRequired AS experienceRequired
            ORDER BY j.title
        `);

        const jobs = result.records.map(record => ({
            id: record.get("id"),
            title: record.get("title"),
            location: record.get("location"),
            experienceRequired: record.get("experienceRequired").toNumber()
        }));

        res.json(jobs);
    } catch (error) {
        console.error("Failed to fetch jobs:", error.message);
        res.status(500).json({
            error: "Unable to fetch jobs"
        });
    } finally {
        await session.close();
    }
});

app.get("/api/jobs/:jobId/matches", async (req, res) => {
    const { jobId } = req.params;
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (j:Job {id: $jobId})-[:REQUIRES]->(s:Skill)<-[:HAS_SKILL]-(c:Candidate)
            RETURN
                c.id AS candidateId,
                c.name AS candidateName,
                collect(s.name) AS matchingSkills,
                count(s) AS matchCount
            ORDER BY matchCount DESC
            `,
            { jobId }
        );

        const matches = result.records.map(record => ({
            candidateId: record.get("candidateId"),
            candidateName: record.get("candidateName"),
            matchingSkills: record.get("matchingSkills"),
            matchCount: record.get("matchCount").toNumber()
        }));

        res.json(matches);
    } catch (error) {
        console.error("Failed to find job matches:", error.message);
        res.status(500).json({
            error: "Unable to find job matches"
        });
    } finally {
        await session.close();
    }
});

app.get("/api/candidates/:candidateId", async (req, res) => {
    const { candidateId } = req.params;
    const session = driver.session();

    try {
        const result = await session.run(
            `
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
            `,
            { candidateId }
        );

        if (result.records.length === 0) {
            return res.status(404).json({
                error: "Candidate not found"
            });
        }

        const record = result.records[0];

        res.json({
            candidateId: record.get("candidateId"),
            candidateName: record.get("candidateName"),
            email: record.get("email"),
            location: record.get("location"),
            experience: record.get("experience").toNumber(),
            skills: record.get("skills"),
            appliedJobs: record.get("appliedJobs"),
            companies: record.get("companies")
        });
    } catch (error) {
        console.error("Failed to fetch candidate:", error.message);
        res.status(500).json({
            error: "Unable to fetch candidate"
        });
    } finally {
        await session.close();
    }
});

app.get("/api/candidates/:candidateId/recommendations", async (req, res) => {
    const { candidateId } = req.params;
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (c:Candidate {id: $candidateId})-[:CONNECTED_TO]->(connected:Candidate)-[:HAS_SKILL]->(s:Skill)
            WITH c, connected, collect(s.name) AS connectedSkills
            MATCH (c)-[:HAS_SKILL]->(mySkill:Skill)
            WITH connected, connectedSkills, collect(mySkill.name) AS currentSkills
            UNWIND connectedSkills AS skill
            WITH connected, skill, currentSkills
            WHERE NOT skill IN currentSkills
            RETURN
                connected.name AS connectedCandidate,
                collect(skill) AS recommendedSkills
            ORDER BY connectedCandidate
            `,
            { candidateId }
        );

        const recommendations = result.records.map(record => ({
            connectedCandidate: record.get("connectedCandidate"),
            recommendedSkills: record.get("recommendedSkills")
        }));

        res.json(recommendations);
    } catch (error) {
        console.error("Failed to fetch recommendations:", error.message);
        res.status(500).json({
            error: "Unable to fetch recommendations"
        });
    } finally {
        await session.close();
    }
});

module.exports = app;