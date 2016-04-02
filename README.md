# simple-preprocessor

A simple Javascript preprocessor. I intended it for node.js, but it can be used for any javascript framework.

## Installation

```
npm install -g simple-preprocessor
```

## Usage
Surround parts of your code you want to conditionally compile in the following way:
```javascript
//ifdef TEST 
function TestFunction() 
{ 
    //some code 
}
//else
function TestFunction2()
{
   //some code
}
//endif
```
### Without Config File
Now, in order to compile this code you will need to run simple-preprocessor in your source directory and specify the TEST directive:
```
simple-preprocessor -D TEST
```
In this case, the result of the preprocessing will be a file with the same name with the `TEST` block included, but with the else block commented out:
```javascript
//ifdef TEST 
function TestFunction() 
{ 
    //some code 
}
//else
//function TestFunction2()
//{
//   //some code
//}
//endif
```
If you don't want to compile this block of code, then don't include this directive:
```
simple-preprocessor
```
In this case, the result of the preprocessing will be a file with the same name (don't worry, your original files are cached within the `.simp-prep-cache` directory before the preprocessing) but with the `TEST` block commented out, and the else block uncommented:
```javascript
//ifdef TEST 
//function TestFunction() 
//{ 
//    //some code 
//}
//else
function TestFunction2()
{
   //some code
}
//endif
```
Of course, you can omit the else block altogether, and this syntax is perfectly valid:
```javascript
//ifdef TEST 
function TestFunction() 
{ 
    //some code 
}
//endif
```
Above examples expect you to run simple-preprocessor from the root directory of your project. Simple-preprocessor automatically walks through all `.js` files in the root directory and in all subdirectories. Should you wish to set the directory (or directories) to walk manually, you would do this:
```
simple-preprocessor -dir path/to/my/dir path/to/another/dir
```
To exclude some directories from the preprocessing you do this (the `node_modules` directory is excluded by default):
```
simple-preprocessor -exclude_dirs dirname anotherDirName
```
Directories with these names will be excluded from the preprocessing, irrespective of their relative path (i.e. `./dir/dirname`, `./dirname`, `dir/dir2/anotherDirName` etc. will all be excluded.
### With Config File
It's easier however to create a config file named *simp-prep-config.json* in the root directory of your project. You can use command `simple-preprocessor init` to automatically create a sample config file in the current directory. *simp-prep-config.json* is a JSON formatted file which supports all above directives. Here is an example:
```json
{
   "D" :
   {
      "TEST" : false,
      "RELEASE" : true
   },
   "dir" : [ "testDir", "myDir" ],
   "exclude_dirs" : [ "anotherDir" ]
}
```
Here *"dir"* specifies the directories to be preprocessed. Other directories in your proejct will be left as they are. Leave this empty ([]) if you want to preprocess all directories. *"D"* specifies defined  (and undefined, if they are *false*) directives. *exclude_dirs* specifies directories key names to exclude.
Then you just run `simple-preprocessor` in the directory with the `simp-prep-config.json` file.
### Updates
- You can now specify several directories as input to the `-dir` command. This also relates to the `dir` property of the config file. In case of config file, you can now specify an array of strings (representing relative directory paths), instead of a single string. See examples above, they all now use this new feature.
- All your files are now backed up before the preprocessing into the `.simp-prep-cache` directory which is created in the directory where `simple-preprocessor` is called. If something happens during the preprocessing (like sudden power outage while a file is being written to), you can use this cache to restore files.
- `.simp-prep-cache` and `.git` directories are now excluded by default.
### Old syntax
Old syntax with `//SIMP_PREP DIRECTIVE` and `//SIMP_PREP_END DIRECTIVE` is still supported, but deprecated. Please, use new syntax.
### Nested directives
Nested directives like those shown below are not supported yet:
```javascript
//ifdef TEST 
function TestFunction() 
{
//ifdef TEST_2
    //some code
//endif    
}
//endif
```
The behavior is undefined is this case.
### Test
To test run
```
npm test
```
from the directory where `simple-preprocessor` is installed.
