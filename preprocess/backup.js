const walk = require('walk')
const path = require('path')
const fs = require('fs')

const Misc = require('../misc.js')

const isWin = (process.platform === "win32")

module.exports = CheckDirAndBackup

function CheckDirAndBackup(args,callback)
{
   args.backUpDir = path.resolve(args.backUpDir)
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

//backup all files to be preprocessed
function BackupFile(pathToFile,str)
{
   pathToFile = path.resolve(pathToFile)
   var pathToDir = path.dirname(pathToFile)
   do
   {
      var createdDir = false
      var dir = pathToDir
      do
      {
         var dirNotCreated = false
         try
         {
            fs.accessSync(dir,fs.F_OK)
         }
         catch(err)
         {
            createdDir = true
            try
            {
               fs.mkdirSync(dir)
            }
            catch(err)
            {
               dir = path.dirname(dir)
               dirNotCreated = true
            }
         }
      } while (dirNotCreated)
   } while(createdDir)
   fs.writeFile(pathToFile,str)
}


function Backup(args,callback)
{
   if (args.noBackup) {
      callback()
      return
   }
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
                  //BackupFile(fileName,str)
                  //next()

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