#!/usr/bin/env node

(function() 
{
   'use strict'

   const fs = require('fs')

   const Preprocess = require('./preprocess/preprocess.js')
   const HandleCliArgs = require('./preprocess/cli-handler.js')
   const HandleConfig = require('./preprocess/config-handler.js')
   const Backup = require('./preprocess/backup.js')
   const Misc = require('./misc.js')

   var args = HandleCliArgs()
   args = HandleConfig(args)
   Misc.say("started preprocessing, dirsToWalk: "+JSON.stringify(args.dirsToWalk));

   if (args.dirsToWalk.length === 0)
      args.dirsToWalk.push(".")

   Backup(args, function()
   {
      Preprocess(args)
   })
   
   process.on('exit', function()
   {
      Misc.say('All done')
   })

})()