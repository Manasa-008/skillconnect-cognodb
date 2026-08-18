const API_BASE = "https://skillconnect-cognodb-4d5e3dbao-skill-connect2.vercel.app";

const jobsContainer = document.getElementById("jobs-container");
const candidateContainer = document.getElementById("candidate-container");

async function loadJobs() {
    try {
        const response = await fetch(`${API_BASE}/api/jobs`);

        if (!response.ok) {
            throw new Error("Failed to load jobs");
        }

        const jobs = await response.json();

        if (jobs.length === 0) {
            jobsContainer.innerHTML = `
                <div class="empty-state">
                    No jobs available.
                </div>
            `;
            return;
        }

        jobsContainer.innerHTML = jobs.map(job => `
            <article class="job-card">
                <div class="job-top">
                    <span class="job-id">${job.id}</span>
                    <span class="job-type">Open Role</span>
                </div>

                <h3>${job.title}</h3>

                <div class="job-details">
                    <span>📍 ${job.location}</span>
                    <span>💼 ${job.experienceRequired} year(s) experience</span>
                </div>

                <button
                    class="job-button"
                    onclick="loadMatches('${job.id}', '${job.title}')">
                    Find Matching Candidates
                    <span>→</span>
                </button>
            </article>
        `).join("");
    } catch (error) {
        jobsContainer.innerHTML = `
            <div class="error-state">
                Unable to load jobs. Please try again.
            </div>
        `;

        console.error(error);
    }
}

async function loadMatches(jobId, jobTitle) {
    candidateContainer.innerHTML = `
        <div class="loading">
            Finding matching candidates...
        </div>
    `;

    document.getElementById("candidates").scrollIntoView({
        behavior: "smooth"
    });

    try {
        const response = await fetch(
            `${API_BASE}/api/jobs/${jobId}/matches`
        );

        if (!response.ok) {
            throw new Error("Failed to load matches");
        }

        const matches = await response.json();

        if (matches.length === 0) {
            candidateContainer.innerHTML = `
                <div class="empty-state">
                    No matching candidates found.
                </div>
            `;
            return;
        }

        candidateContainer.innerHTML = `
            <div class="candidate-card">

                <div class="candidate-header">
                    <div>
                        <p class="eyebrow">MATCHING CANDIDATES</p>
                        <h3>Best matches for ${jobTitle}</h3>
                    </div>
                </div>

                ${matches.map(candidate => `
                    <div class="recommendation-item">

                        <div class="match-header">
                            <div>
                                <strong>${candidate.candidateName}</strong>
                                <p>
                                    ${candidate.matchCount}
                                    required skill(s) matched
                                </p>
                            </div>

                            <span class="match-score">
                                ${candidate.matchCount}
                                skill${candidate.matchCount === 1 ? "" : "s"}
                            </span>
                        </div>

                        <div class="skills">
                            ${candidate.matchingSkills.map(skill => `
                                <span class="skill">${skill}</span>
                            `).join("")}
                        </div>

                        <button
                            class="job-button"
                            onclick="loadCandidate('${candidate.candidateId}')">
                            View Candidate Profile
                            <span>→</span>
                        </button>

                    </div>
                `).join("")}

            </div>
        `;
    } catch (error) {
        candidateContainer.innerHTML = `
            <div class="error-state">
                Unable to load matching candidates.
            </div>
        `;

        console.error(error);
    }
}

async function loadCandidate(candidateId) {
    candidateContainer.innerHTML = `
        <div class="loading">
            Loading candidate profile...
        </div>
    `;

    document.getElementById("candidates").scrollIntoView({
        behavior: "smooth"
    });

    try {
        const profileResponse = await fetch(
            `${API_BASE}/api/candidates/${candidateId}`
        );

        const recommendationResponse = await fetch(
            `${API_BASE}/api/candidates/${candidateId}/recommendations`
        );

        if (!profileResponse.ok || !recommendationResponse.ok) {
            throw new Error("Failed to load candidate profile");
        }

        const candidate = await profileResponse.json();
        const recommendations = await recommendationResponse.json();

        candidateContainer.innerHTML = `
            <div class="candidate-card">

                <div class="candidate-header">
                    <div>
                        <p class="eyebrow">CANDIDATE PROFILE</p>

                        <h3>${candidate.candidateName}</h3>

                        <p class="job-info">
                            ${candidate.email}
                        </p>

                        <p class="job-info">
                            📍 ${candidate.location}
                        </p>
                    </div>

                    <span class="badge">
                        ${candidate.experience} year(s) experience
                    </span>
                </div>

                <div>
                    <strong>Skills</strong>

                    <div class="skills">
                        ${candidate.skills.map(skill => `
                            <span class="skill">${skill}</span>
                        `).join("")}
                    </div>
                </div>

                <div class="recommendations">

                    <strong>Recommended Skills</strong>

                    ${
                        recommendations.length === 0
                        ? `
                            <p class="job-info">
                                No new skill recommendations.
                            </p>
                        `
                        : recommendations.map(item => `
                            <div class="recommendation-item">

                                <p class="job-info">
                                    Based on skills in your
                                    professional network
                                </p>

                                <div class="skills">
                                    ${item.recommendedSkills.map(skill => `
                                        <span class="skill">
                                            ${skill}
                                        </span>
                                    `).join("")}
                                </div>

                            </div>
                        `).join("")
                    }

                </div>

            </div>
        `;
    } catch (error) {
        candidateContainer.innerHTML = `
            <div class="error-state">
                Unable to load candidate profile.
            </div>
        `;

        console.error(error);
    }
}

loadJobs();