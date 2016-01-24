# simple-preprocessor

A simple Javascript preprocessor. I intended it for node.js, but it can be used for any javascript framework.

## Installation

```
npm install -g simple-preprocessor
```

## Usage
Surround parts of your code you want to conditionally compile in the following way:
```javascript
//SIMP_PREP TEST 
function TestFunction() 
{ 
    //some code 
} 
//SIMP_PREP_END TEST
```
### Without Config File
Now, in order to compile this code you will need to run simple-preprocessor in your source directory and specify the TEST directive:
```
simple-preprocessor -D TEST
```
In this case, the result of the preprocessing will be a file with the same name and exactly as it is shown above, i.e. with the `TEST` block included.
If you don't want to compile this block of code, then don't include this directive:
```
simple-preprocessor
```
In this case, the result of the preprocessing will be a file with the same name but with the TEST block commented out:
```javascript
//SIMP_PREP TEST 
//function TestFunction() 
//{ 
    //some code 
//} 
//SIMP_PREP_END TEST
```
Above examples expect you to run simple-preprocessor from the root directory of your project. Simple-preprocessor automatically walks through all `.js` files in the root directory and in all subdirectories. Should you wish to set the directory to walk manually, you would do this:
```
simple-preprocessor -dir /path/to/my/dir
```
To exclude some directories from the preprocessing you do this (the node_modules directory is excluded by default):
```
simple-preprocessor -exclude_dirs /path/to/my/dir /another/dir
```
### With Config File
It's easier however to create a config file named `simp-prep-config.json` in the root directory of your project. This is a JSON formatted file which supports all above directives. Here is an example:
```json
{
   "D" :
   {
      "TEST" : false,
      "RELEASE" : true
   },
   "dir" : "testDir",
   "exclude_dirs" : [ "anotherDir" ]
}
```
Then you just run `simple-preprocessor` in the directory with the `simp-prep-config.json` file.
### Test
To test run:
```
npm test
```
