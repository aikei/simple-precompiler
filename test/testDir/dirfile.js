var Execute = function()
{
   console.log("NONE")
   return "NONE"
}

//SIMP_PREP TEST
//Execute = function()
//{
//   console.log("TEST")
//   return "TEST"
//}
//SIMP_PREP_END TEST

//SIMP_PREP RELEASE
Execute = function()
{
   console.log("RELEASE")
   return "RELEASE"
}
//SIMP_PREP_END RELEASE

module.exports = Execute