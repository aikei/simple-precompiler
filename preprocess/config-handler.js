'use strict';

const fs = require('fs')
const Misc = require('../misc.js')

module.exports = HandleConfig;

function HandleConfig(args)
{
   try
   {
      var config = fs.readFileSync(args.config)
      try
      {
         config = JSON.parse(config)

         if (config.D)
         {
            for (var key in config.D)
            {
               if (config.D[key])
                  args.directives[key] = true
            }
         }
         
         if (Array.isArray(config.dir))
         {
            args.dirsToWalk = dirsToWalk.concat(config.dir)
         }
         else if (typeof config.dir === "string")
         {
            args.dirsToWalk.push(config.dir)
         }
         
         if (config.exclude_dirs)
         {
            for (var i = 0; i < config.exclude_dirs.length; i++)
            {
               args.excludeDirs.push(config.exclude_dirs[i])
            }
         }
      }
      catch(err)
      {
         Misc.log('simp-prep-config.json parse error:',err)
      }
   }
   catch(err)
   {
      Misc.log('warning! simp-prep-config.json not found')
   }

   return args
}