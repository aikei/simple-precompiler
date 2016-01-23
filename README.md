# simple-precompiler
A simple javascript precompiler. I intended it for node.js, but it can be used for any javascript framework.
Usage:
Surround parts of your code you want to conditionally compile in the following way:

//SIMP_PREC TEST
function TestFunction()
{
   //some code
}
//SIMP_PREC_END TEST

Now, in order to compile this code you will need to run simple-precompiler in your source directory and specify the TEST directive:

simple-precompiler -D TEST

If you don't want to compile this code, you don't include this directive:

simple-precompiler

In this case, the result of precompilation will be:

//SIMP_PREC TEST
//function TestFunction()
//{
   //some code
//}
//SIMP_PREC_END TEST