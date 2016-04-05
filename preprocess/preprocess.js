'use strict';

module.exports = Preprocess;

const walk = require('walk')
const path = require('path')
const fs = require('fs')

const isWin = (process.platform === "win32")

var foundPresentDirective = false
var foundAbsentDirective = false
var foundElse = false

function Preprocess(args)
{
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
            
            if (!exclude)
            {
               var fileName = path.resolve(root, fileStat.name)
               
               if (path.extname(fileStat.name) == '.js')
               {
                  fs.readFile(fileName, { enconding : 'utf8' }, function(err, data)
                  {
                     var str = data.toString()
                     console.log('preprocessing file',fileName)
                     str = PreprocessString(args.directives,str)
                     fs.writeFile(fileName,str)
                  })
               }
            }
            
            next()
         })

         walker.on('error', function(root, nodeStatsArray, next)
         {
            nodeStatsArray.forEach(function(n)
            {
               console.error("[ERROR] "+n.name)
               console.error(n.error.message || (n.error.code + ": " + n.error.path))
            })
            next()
         })
      })(args.dirsToWalk[i])
   }   
}

function PreprocessString(directives,str)
{
   var strs = str.split('\n')
   
   for (var i = 0; i < strs.length; i++)
   {
      var words = strs[i].split(" ")
      
      if (strs[i].charAt(0) === "/" && strs[i].charAt(1) === "/")
      {
         var leftWord = words[0].trim()
         if (!foundPresentDirective && !foundAbsentDirective && strs[i].length > 2)
         {
            if (words[1] && words[1].length > 0)
            {
               words[1] = words[1].trim()
               if (leftWord === "//SIMP_PREC" || leftWord === "//SIMP_PREP" || leftWord === "//ifdef")
               {
                  if (directives[words[1]])
                  {
                     console.log('found present ifdef directive',words[1])
                     foundPresentDirective = true                 
                  }
                  else
                  {
                     console.log('found absent ifdef directive',words[1])
                     foundAbsentDirective = true
                  }
                  continue
               }
            }
            /*
            else if (leftWord === "//ifndef")
            {
               if (!directives[words[1])
               {
                  console.log('found absent ifndef directive',words[1])
                  foundPresentDirective = true
               }
               else
               {
                  console.log('found present ifndef directive',words[1])
                  foundAbsentDirective = true
               }
            }
            */
         }

         if (leftWord === "//else")
         {
            foundElse = true
            continue
         }
         
         if (leftWord == "//SIMP_PREC_END" || leftWord == "//SIMP_PREP_END" || leftWord === "//endif")
         {
            foundElse = false
            foundAbsentDirective = false
            foundPresentDirective = false
         }           
      }
      
      if ((foundPresentDirective && !foundElse) || (foundAbsentDirective && foundElse))
      {
         if (words[0].charAt(0) === "/" && words[0].charAt(1) === "/")
         {
            words[0] = words[0].slice(2)
         }
      }
      
      if ((foundAbsentDirective && !foundElse) || (foundPresentDirective && foundElse))
      {
         if (words[0].charAt(0) != "/" || words[0].charAt(1) != "/")
         {
            words[0] = "//"+words[0]
         }             
      }
      strs[i] = words.join(' ')
   }
   return strs.join('\n')
}
