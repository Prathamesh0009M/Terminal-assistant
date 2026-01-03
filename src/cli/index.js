#!/usr/bin/env node

const { Command } = require("commander");
const { prCommand } = require("../commands/pr");
require("dns").setDefaultResultOrder("ipv4first");

const program = new Command();

program
  .name("shellmind")
  .description("Simple GitHub CLI")
  .version("0.1.0");

program
  .command("pr")
  .description("List open GitHub PRs")
  .action(prCommand);

program.parse(process.argv);
