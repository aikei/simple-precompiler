const walk = require('walk')
const path = require('path')
const fs = require('fs')

const Misc = require('../misc.js')

const isWin = (process.platform === "win32")

module.exports = CheckDirAndBackup

//backup all files to be preprocessed
function CheckDirAndBackup(args,callback)
{
   args.backUpDir = path.resolve(args.backUpDir);
   Misc.log("args.backUpDir: ",args.backUpDir)
   try
   {
      fs.accessSync(args.backUpDir,fs.F_OK)
   }
   catch(err)
   {
      fs.mkdirSync(args.backUpDir)
   }
   finally
   {
      Backup(args,callback)
   }
}

function Backup(args,callback)
{
   if (args.noBackup)
      return;
   Misc.log("backing up all source files to ./.simp-prep-cache/*")
   Misc.log("args = "+JSON.stringify(args))
   for (var i = 0; i < args.dirsToWalk.length; i++)
   {
      (function(curDir) {
         var walker = walk.walk(curDir, { followLinks: false, filters : args.excludeDirs })

         walker.on('file', function (root, fileStat, next)
         {
            var exclude = false
            
            if (isWin)
               var folders = root.split('\\')
            else
               folders = root.split('/')
             Misc.log("fileStat.name = "+fileStat.name)
            var fileName = path.resolve(root, fileStat.name)
            Misc.log("fileName = "+fileName)
            if (path.extname(fileStat.name) == '.js')
            {
               fs.readFile(fileName, { enconding : 'utf8' }, function(err, data)
               {
                  var str = data.toString()
                  Misc.log('backing up file',fileName)
                  fileName = path.relative(".",fileName)
                  fileName = path.join(args.backUpDir,fileName)
                  var dir = path.dirname(fileName)
                  Misc.log('dirname:',dir)
                  try 
                  {
                     fs.accessSync(dir,fs.F_OK)
                  }
                  catch(err)
                  {
                     fs.mkdirSync(dir)
                  }
                  finally
                  {
                     Misc.log("backup fileName: "+fileName)
                     fs.writeFile(fileName,str)
                     next()
                  }
               })
            } 
            else 
            {
               next()
            }
            
         })

         walker.on('error', function(root, nodeStatsArray, next)
         {
            nodeStatsArray.forEach(function(n)
            {
               Misc.error("[ERROR] "+n.name)
               Misc.error(n.error.message || (n.error.code + ": " + n.error.path))
            })
            next()
         })

         walker.on('end', function()
         {
            Misc.log("Backup done")
            callback()
         })

      })(args.dirsToWalk[i])
   }
}