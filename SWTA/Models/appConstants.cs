using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Dapper;

namespace SWTA.Models
{
  public static class appConstants
  {
    public const int toolsAppId = 20021;
    public const bool isProduction = false;

    public static string Get_ConnStr()
    {
      return ConfigurationManager.ConnectionStrings[isProduction ? "SolidWaste" : "Local"].ConnectionString;
    }

    public enum queryType : int
    {
      normal = 0,
      difference_build_assessed = 1,
      difference_collected_assessed = 2,
      difference_hardship = 3,
      difference_veteran = 4,
      difference_year_to_year = 5,
      //difference_year_collected = 6,
      //difference_year_assessed = 7,
      new_this_year = 8,
      removed_this_year = 9,
      difference_reclassified = 10,
      new_this_year_no_codate = 11
    }

  }
}