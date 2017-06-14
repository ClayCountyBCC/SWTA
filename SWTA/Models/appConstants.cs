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

    //public static DB Get_DB()
    //{
    //  return new DB(Get_ConnStr(), toolsAppId,
    //          DB.DB_Error_Handling_Method.Send_Errors_To_Log_Only);
    //}

    public static string Get_ConnStr()
    {
      return ConfigurationManager.ConnectionStrings[isProduction ? "SolidWaste" : "Local"].ConnectionString;
    }

    //public static void Log(Exception e)
    //{
    //  Logging.Log(e, toolsAppId, "", Logging.LogType.Database);
    //}

    //public static void Log(Exception e, string query)
    //{
    //  Logging.Log(e, toolsAppId, query, Logging.LogType.Database);
    //}

    //public static void Log(string Message)
    //{
    //  Logging.Log(toolsAppId, "Error in Solid Waste Tax Assessment Application ", Message, "", "", Logging.LogType.Database);
    //}

  }
}