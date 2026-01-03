const simpleGit = require("simple-git");

const git = simpleGit(process.cwd());

async function checkoutPR(prNumber) {
    
  const branchName = `pr-${prNumber}`;

  try {
    console.log(`\nFetching PR #${prNumber}...`);
    await git.fetch("origin", `pull/${prNumber}/head:${branchName}`);

    console.log(`Checking out ${branchName}...`);
    await git.checkout(branchName);

    console.log(`✅ Switched to branch '${branchName}'`);
  } catch (err) {
    console.error("❌ Failed to checkout PR:", err.message);
  }
}

module.exports = { checkoutPR };
