var Execute = function()
{
   console.log("NONE")
   return "NONE"
}

//ifdef TEST
//Execute = function()
//{
//   console.log("TEST")
//   return "TEST"
//}
//endif

//ifdef RELEASE
//Execute = function()
//{
//   console.log("RELEASE")
//   return "RELEASE"
//}
//endif

//ifdef IFTEST
//module.exports = function()
//{
//   console.log("IFTEST")
//   return "IFTEST"
//}   
//else
module.exports = Execute
//endif

