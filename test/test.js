(function() {

'use strict'

var child_process = require('child_process')
var fs = require('fs')
var success = 0
var fail = 0

function Test(value,result)
{
   if (value !== result)
      return false
   return true
}

var preprocessCmd = 'node simple-preprocessor.js '
var testfile = require('./testfile.js')

var dirFileName = './testDir/dirfile.js'
var dirfile = require(dirFileName)

var dir2fileName = './testDir2/dirfile.js'
var dir2file = require(dir2fileName)

var dir3fileName = './testDir3/dirfile.js'
var dir3file = require(dir3fileName)

function ExecuteTest(number, explain, command, testFile, fileResult, dirFileResult, dir2FileResult, dir3FileResult)
{
   console.log("Test",number,explain)
   child_process.execSync(preprocessCmd)  //clears files to exclude all directives before the test
   if (command)
   {
      console.log("executing command: ",preprocessCmd + command)
      child_process.execSync(preprocessCmd + command)   
   }
   else if (testFile)
   {
      testFile = fs.readFileSync(testFile)
      fs.writeFileSync('simp-prep-config.json',testFile)
      child_process.execSync(preprocessCmd)
      fs.unlinkSync('simp-prep-config.json')
   }
   else
   {
      console.log('specify either command or config file!')
   }
   //delete cache of require to load new preprocessed files with require
   delete require.cache[require.resolve('./testfile.js')]
   delete require.cache[require.resolve('./testDir/dirfile.js')]
   delete require.cache[require.resolve(dir2fileName)]
   delete require.cache[require.resolve(dir3fileName)]
   testfile = require('./testfile.js')
   dirfile = require('./testDir/dirfile.js')
   dir2file = require(dir2fileName)
   dir3file = require(dir3fileName)
   //check if result matches
   if (!Test(testfile(), fileResult) || !Test(dirfile(), dirFileResult) || (dir2FileResult && !Test(dir2file(), dir2FileResult)) || (dir3FileResult && !Test(dir3file(), dir3FileResult)))
   {
      console.log("Test",number,"failed")
      fail++
   }
   else
   {
      success++
      console.log("Test",number,"pass")
   }      
}

ExecuteTest(1,"command line with -D TEST", "-D TEST",null, "TEST", "TEST")
ExecuteTest(2,"command line with -D RELEASE -exclude_dirs testDir", "-D RELEASE -exclude_dirs testDir",null, "RELEASE", "NONE")
ExecuteTest(3,"command line with -D RELEASE -dir test/testDir", "-D RELEASE -dir test/testDir",null, "NONE", "RELEASE")
ExecuteTest(4,"config file with { 'D' : { 'TEST' : true } }", null,"test/simp-prep-config-test-D.json", "TEST", "TEST")
ExecuteTest(5,"config file with { 'D' : { 'TEST' : true }, 'exclude_dirs' : [ 'testDir' ] }", null,"test/simp-prep-config-test-D-exclude_dirs.json", "TEST", "NONE")
ExecuteTest(6,"config file with { 'D' : { 'RELEASE' : true }, 'dir' : 'test/testDir' }", null,"test/simp-prep-config-test-D-dir.json", "NONE", "RELEASE")
ExecuteTest(7,"command line with -D IFTEST", "-D IFTEST",null, "IFTEST", "NONE")
ExecuteTest(8,"command line with -D TEST -dir test/testDir2 test/testDir","-D TEST -dir test/testDir2 test/testDir",null,"NONE","TEST","TEST","NONE")

//clean test files to defaults
child_process.execSync(preprocessCmd)

console.log('succedeed:',success,'| failed:',fail)

}())