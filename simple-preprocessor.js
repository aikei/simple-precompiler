#!/usr/bin/env node

(function() 
{
   
'use strict';

var fs = require('fs')
var path = require('path')
var walk = require('walk')

var directives = new Set()
var excludeDirs = new Set([ 'node_modules' ])
var foundPresentDirective = false
var foundAbsentDirective = false
var dirToWalk = '.'
var includeSubdirectories = true

var lookFileDone = false

for (var i = 2; i < process.argv.length; i++)
{
   if (process.argv[i] === '-dir')
   {
      if (process.argv.length <= i+1)
      {
         console.log('Error! No directory specified after -dir')
         process.exit()
      }
      else
      {
         i++
         dirToWalk = process.argv[i]
      }
   }
   else if (process.argv[i] === '-exclude_dirs')
   {
      if (process.argv.length <= i+1)
      {
         console.log('Error! No directories specified after -exclude_dirs')
         process.exit()
      }      
      i++
      while (i < process.argv.length && process.argv[i].charAt(0) != '-')
      {
         console.log('excluding directory',process.argv[i])
         excludeDirs.add(process.argv[i])
         i++
      } 
   }    
   else if (process.argv[i] === '-D')
   {     
      if (process.argv.length <= i+1)
      {
         console.log('Error! No directives specified after -D')
         process.exit()
      }       
      i++
      while (i < process.argv.length && process.argv[i].charAt(0) != '-')
      {
         console.log('adding directive',process.argv[i])
         directives.add(process.argv[i])
         i++
      } 
   }
   else if (process.argv[i] === 'no_subdirs')
   {
      includeSubdirectories = false
   }
}

var walker = walk.walk(dirToWalk, { followLinks: includeSubdirectories })

function PreprocessString(str)
{
   var strs = str.split('\n')
   iCycle:
   for (var i = 0; i < strs.length; i++)
   {
      var words = strs[i].split(" ")
      
      if (strs[i].charAt(0) === "/" && strs[i].charAt(1) === "/")
      {        
         if (!foundPresentDirective && !foundAbsentDirective && strs[i].length > 2)
         {
            if (words[0] === "//SIMP_PREC" && words[1].length > 0)
            {
               words[1] = words[1].trim()
               if (directives.has(words[1]))
               {
                  console.log('found present directive',words[1])
                  foundPresentDirective = true
                  continue iCycle
               }
               else
               {
                  console.log('found absent directive',words[1])
                  foundAbsentDirective = true
                  continue iCycle
               }
            }
         }

         if (words[0] == "//SIMP_PREC_END")
         {
            foundAbsentDirective = false
            foundPresentDirective = false
         }           
      }
      
      if (foundPresentDirective)
      {
         if (words[0].charAt(0) === "/" && words[0].charAt(1) === "/")
         {
            words[0] = words[0].slice(2)
         }
      }
      else if (foundAbsentDirective)
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


walker.on('file', function (root, fileStat, next)
{
   var exclude = false
   
   var folders = root.split('\\')

   for (var i = 0; i < folders.length; i++)
   {
      if (excludeDirs.has(folders[i]))
      {
         exclude = true
         break
      }
   }
   
   if (!exclude)
   {
      var fileName = path.resolve(root, fileStat.name)
      
      if (path.extname(fileStat.name) == '.js')
      {

         fs.readFile(fileName, { enconding : 'utf8' }, function(err, data)
         {
            var str = data.toString()
            console.log('preprocessing file',fileName)
            str = PreprocessString(str)
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


process.on('exit', function()
{
   console.log('precompiling done') 
})

}())