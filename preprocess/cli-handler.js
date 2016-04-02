'use strict';

module.exports = HandleCliArgs;

const Misc = require('../misc.js');
const fs = require('fs');

var args = 
{ 
	directives : {},
	dirsToWalk : [],
	excludeDirs : [ 'node_modules', '.simp-prep-cache', '.git' ],
	backUpDir : ".simp-prep-cache/"
}

function HandleCliArgs() 
{
	if (process.argv[2] === 'init')
	{
		try 
		{
			fs.accessSync('./simp-prep-config.json',fs.F_OK)
			Misc.log('simp-prep-config.json file already exists. use force-init to replace it with the new one.')
		}
		catch(err)
		{
			CreateConfig()
		}
		process.exit()
	}
	else if (process.argv[2] === 'force-init')
	{
		CreateConfig()
		process.exit()
	}

	for (var i = 2; i < process.argv.length; i++)
	{
		if (process.argv[i] === '-dir')
		{
			if (process.argv.length <= i+1 ||  process.argv[i+1].charAt(0) === '-')
			{
				Misc.log('Error! No directory specified after -dir')
				process.exit()
			}
			i++
			while (i < process.argv.length && process.argv[i].charAt(0) != '-')
			{
				Misc.log("adding dir to walk: "+process.argv[i])
				args.dirsToWalk.push(process.argv[i])
				i++
			}
		}
		else if (process.argv[i] === '-exclude_dirs')
		{
			if (process.argv.length <= i+1 ||  process.argv[i+1].charAt(0) === '-')
			{
				Misc.log('Error! No directories specified after -exclude_dirs')
				process.exit()
			}      
			i++
			while (i < process.argv.length && process.argv[i].charAt(0) != '-')
			{
				Misc.log('excluding directory',process.argv[i])
				args.excludeDirs.push(process.argv[i])
				i++
			} 
		}    
		else if (process.argv[i] === '-D')
		{     
			if (process.argv.length <= i+1 ||  process.argv[i+1].charAt(0) === '-')
			{
				Misc.log('Error! No directives specified after -D')
				process.exit()
			}       
			do 
			{
				i++
				Misc.log('adding directive',process.argv[i])
				args.directives[process.argv[i]] = true
			} while (i+1 < process.argv.length && process.argv[i+1].charAt(0) != '-')
		}
	}

	return args
}

function CreateConfig()
{
     const initConfig =
     '{\n'+
        '   "D" :\n'+
        '   {\n'+
        '      \n'+
        '   },\n'+
        '   "dir" : [],\n'+
        '   "exclude_dirs" : [ "node_modules", ".simp-prep-cache", ".git" ]\n'+
     '}\n'
     fs.writeFileSync('./simp-prep-config.json',initConfig)  
}