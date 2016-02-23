#!/usr/bin/env node

import cmdline from 'commander'
import findUpSync from 'findup-sync'
import sysexits from 'sysexits'
import DNSMEDDNSUpdater from '../index.js'

cmdline
  .description('Keeps DNS Made Easy dynamic DNS records up-to-date')
  .version(require(findUpSync('package.json', {cwd:__dirname})).version)
  .option('--username [username]', 'DNS Made Easy username (required)')
  .option('--record-id [recordId]', 'Record identifier (required)')
  .option('--password [password]', 'Record password (required)')
  .option('--check-interval [checkInterval]', 'Seconds between public IP checks', parseInt)
  .parse(process.argv)

const {username, recordId, password, checkInterval} = cmdline

if (username === undefined || recordId === undefined || password === undefined) {
  cmdline.outputHelp()
  process.exit(sysexits.USAGE)
}

const updater = new DNSMEDDNSUpdater({username, recordId, password, checkInterval})
updater
  .on('change', ip => console.warn(`public IP change: ${ip}`))
  .on('error', err => console.warn((err && err.message) || err))