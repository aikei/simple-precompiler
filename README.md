# simple-preprocessor

A simple Javascript preprocessor. I intended it for node.js, but it can be used for any javascript framework.

## Installation

```
npm install -g simple-preprocessor
```

## Usage
Surround parts of your code you want to conditionally compile in the following way:
```javascript
//SIMP_PREC TEST 
function TestFunction() 
{ 
    //some code 
} 
//SIMP_PREC_END TEST
```
Now, in order to compile this code you will need to run simple-preprocessor in your source directory and specify the TEST directive:
```
simple-preprocessor -D TEST
```
If you don't want to compile this code, you don't include this directive:
```
simple-preprocessor
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
Above examples expect you to run simple-preprocessor from the root directory of your project. Simple-preprocessor automatically walks through all .js files in the root directory and in all subdirectories. Should you wish to set the directory to walk manually, you would do this:
```
simple-preprocessor -dir /path/to/my/dir
```
To exclude some directories from the precompiling you do this (the node_modules directory is excluded by default):
```
simple-preprocessor -exclude_dirs /path/to/my/dir /another/dir
```
Don't walk through subdirectories:
```
simple-preprocessor -no_subdirs
```
