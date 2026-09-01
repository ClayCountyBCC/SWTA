using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Dapper;

namespace SolidWasteTaxAssessmentReact.Models
{
  public static class appConstants
  {
    public const int toolsAppId = 20021;
    private const string DefaultProductionMachineName = "claybcciis01";

    // Use the IIS machine name so anything outside the production server stays on the local connection string.
    public static bool isProduction
    {
      get { return IsProductionMachine(); }
    }

    public static string Get_ConnStr()
    {
      return ConfigurationManager.ConnectionStrings[isProduction ? "SolidWaste" : "Local"].ConnectionString;
    }

    private static bool IsProductionMachine()
    {
      var configuredMachineName = GetConfiguredProductionMachineName();

      if (string.IsNullOrWhiteSpace(configuredMachineName))
      {
        configuredMachineName = DefaultProductionMachineName;
      }

      var machineName = Environment.MachineName;

      return string.Equals(configuredMachineName.Trim(), machineName, StringComparison.OrdinalIgnoreCase);
    }

    private static string GetConfiguredProductionMachineName()
    {
      var machineSetting = ConfigurationManager.ConnectionStrings["ProductionMachineName"];

      if (machineSetting == null)
      {
        return null;
      }

      return machineSetting.ConnectionString;
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
