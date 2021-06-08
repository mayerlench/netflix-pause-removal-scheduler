#!/usr/bin/env node

const fs = require('fs');
const semver = require('semver');
const packageJson = require('../package.json');
const manifestJson = require('../src/manifest.json');

const { version } = packageJson;
const newVersion = semver.inc(version, 'patch')

manifestJson.version = newVersion
packageJson.version = newVersion

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2))
fs.writeFileSync('src/manifest.json', JSON.stringify(manifestJson, null, 2))
