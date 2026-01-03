const { blue, yellow, green, cyan } = require("chalk");
const { prompt } = require("inquirer");
const { fetchPRs, fetchPRDetails, fetchPRFiles } = require("../github/githubService");
const open = require("open");
const exec = require("child_process").exec;
const { checkoutPR } = require("../git/gitService");

async function prCommand() {
    console.log(blue("Fetching open PRs..."));

    const prs = await fetchPRs();

    if (!prs.length) {
        console.log(yellow("No open PRs found."));
        return;
    }

    const choices = prs.map(pr => ({
        name: `#${pr.number} ${pr.title} — by ${pr.user.login}`,
        value: pr.number,
    }));

    const { prNumber } = await prompt([
        {
            type: "list",
            name: "prNumber",
            message: "Select a PR",
            choices: prs.map(pr => ({
                name: `#${pr.number} ${pr.title} — by ${pr.user.login}`,
                value: pr.number,
            })),
        },
    ]);


    const { action } = await prompt([
        {
            type: "list",
            name: "action",
            message: "What do you want to do?",
            choices: [
                { name: "View PR details", value: "details" },
                { name: "Open PR in browser", value: "open" },
                { name: "Checkout PR locally", value: "checkout" },
            ],
        },
    ]);



    if (action === "checkout") {
        await checkoutPR(prNumber);
        return;
    }

    const prDetails = await fetchPRDetails(prNumber);
    if (!prDetails) return;
    if (action === "open") {
        console.log(cyan(`Opening PR #${prNumber} in browser...`));
        let command = `start ${prDetails.html_url}`;
        exec(command);
        return;
    }

    const pr = prs.find(p => p.number === prNumber);

    console.log(green(`\nPR #${prDetails.number} - ${prDetails.title}`));
    console.log(`Author: ${prDetails.user.login}`);
    console.log(
        `Base → Head: ${cyan(prDetails.base.ref)} → ${cyan(prDetails.head.ref)}`
    );
    console.log(`Commits: ${prDetails.commits}`);
    console.log(`Files changed: ${prDetails.changed_files}`);
    console.log(
        `+${prDetails.additions}  -${prDetails.deletions}`
    );

    const labels = prDetails.labels.map(l => l.name).join(", ");
    console.log(`Labels: ${labels || "None"}`);

    console.log(`Merge status: ${prDetails.mergeable_state}`);


    const files = await fetchPRFiles(prNumber);

    if (!files.length) {
        console.log(yellow("\nNo files changed."));
        return;
    }

    console.log(blue(`\nChanged Files (${files.length}):\n`));

    files.forEach(file => {
        const statusMap = {
            added: "A",
            modified: "M",
            removed: "D",
            renamed: "R",
        };

        const status = statusMap[file.status] || "?";

        console.log(
            `${cyan(status)}  ${file.filename.padEnd(30)}  ` +
            green(`+${file.additions}`) +
            "  " +
            yellow(`-${file.deletions}`)
        );
    });




}

module.exports = { prCommand };
