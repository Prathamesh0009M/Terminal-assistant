const axios = require("axios");
require("dotenv").config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO;

if (!GITHUB_TOKEN || !REPO) {
    console.error("❌ Missing GITHUB_TOKEN or GITHUB_REPO in .env");
    process.exit(1);
}

const BASE_URL = "https://api.github.com";
const api = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
    },
});

async function fetchPRs() {
    try {
        const res = await api.get(`/repos/${REPO}/pulls`);
        return res.data;
    } catch (err) {
        console.error("❌ Failed to fetch PRs:", err.response?.data || err.message);
        return [];
    }
}

async function fetchPRDetails(prNumber) {
    try {
        const res = await axios.get(
            `${BASE_URL}/repos/${process.env.GITHUB_REPO}/pulls/${prNumber}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        return res.data;
    } catch (err) {
        console.error("❌ Failed to fetch PR details:", err.message);
        return null;
    }
}

async function fetchPRFiles(prNumber) {
    try {
        const res = await axios.get(
            `${BASE_URL}/repos/${process.env.GITHUB_REPO}/pulls/${prNumber}/files`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        return res.data;
    } catch (err) {
        console.error("❌ Failed to fetch PR files:", err.message);
        return [];
    }
}



module.exports = {
    fetchPRs,
    fetchPRDetails,
    fetchPRFiles
};

