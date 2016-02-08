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
//endif TEST

//ifdef RELEASE
//Execute = function()
//{
//   console.log("RELEASE")
//   return "RELEASE"
//}
//endif RELEASE

module.exports = Execute