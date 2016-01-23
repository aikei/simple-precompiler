# simple-precompiler
A simple Javascript precompiler. I intended it for node.js, but it can be used for any javascript framework. Usage: Surround parts of your code you want to conditionally compile in the following way:
```javascript
//SIMP_PREC TEST 
function TestFunction() 
{ 
    //some code 
} 
//SIMP_PREC_END TEST
```
Now, in order to precompile this code you will need to run simple-precompiler in your source directory and specify the TEST directive:
```
simple-precompiler -D TEST
```
If you don't want to compile this code, you don't include this directive:
```
simple-precompiler
```
In this case, the result of precompilation will be the file with the same name but with the TEST block commented out:
```javascript
//SIMP_PREC TEST 
//function TestFunction() 
//{ 
    //some code 
//} 
//SIMP_PREC_END TEST
```
Above examples expect you to run simple-precompiler from the root directory of your project. Simple-precompiler automatically walks through all .js files in the root directory and in all subdirectories. Should you wish to set the directory to walk manually, you must do this:
```
simple-precompiler -dir /path/to/my/dir
```
To exclude some directories from the precompiling you do this:
```
simple-precompiler -exclude_dirs /path/to/my/dir /another/dir
```
Don't walk through subdirectories:
```
simple-precompiler -no_subdirs
```