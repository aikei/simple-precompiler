#!/usr/bin/env node

(function() 
{
   
'use strict';

var fs = require('fs')
var path = require('path')
var walk = require('walk')

var directives = {}
var excludeDirs = [ 'node_modules' ]
var foundPresentDirective = false
var foundAbsentDirective = false
var foundElse = false
var dirToWalk = '.'


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
         excludeDirs.push(process.argv[i])
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
      do 
      {
         i++
         console.log('adding directive',process.argv[i])
         directives[process.argv[i]] = true
      } while (i+1 < process.argv.length && process.argv[i+1].charAt(0) != '-')
   }
}

try
{
   var config = fs.readFileSync(dirToWalk+'/simp-prep-config.json')
   try
   {
      config = JSON.parse(config)

      if (config.D)
      {
         for (var key in config.D)
         {
            if (config.D[key])
               directives[key] = true
         }
      }
      
      if (config.dir)
      {
         dirToWalk = config.dir
      }
      
      if (config.exclude_dirs)
      {
         for (var i = 0; i < config.exclude_dirs.length; i++)
         {
            excludeDirs.push(config.exclude_dirs[i])
         }
      }
   }
   catch(err)
   {
      console.log('simp-prep-config.json parse error:',err)
   }
}
catch(err)
{
   console.log('warning! simp-prep-config.json not found')
}

var walker = walk.walk(dirToWalk, { followLinks: true, filters : excludeDirs })

function PreprocessString(str)
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
            if ((leftWord === "//SIMP_PREC" || leftWord === "//SIMP_PREP" || leftWord === "//ifdef") && words[1].length > 0)
            {
               words[1] = words[1].trim()
               if (directives[words[1]])
               {
                  console.log('found present directive',words[1])
                  foundPresentDirective = true                 
               }
               else
               {
                  console.log('found absent directive',words[1])
                  foundAbsentDirective = true
               }
               continue
            }
         }
         console.log("leftWord = [",leftWord,"]")
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


walker.on('file', function (root, fileStat, next)
{
   var exclude = false
   
   var folders = root.split('\\')
   
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