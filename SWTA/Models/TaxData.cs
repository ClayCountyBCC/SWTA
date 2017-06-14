using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Data.SqlClient;
using System.Text;

namespace SWTA.Models
{
  public static class TaxData
  {
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


        
    public static TaxAssessment getData(string PID)
    {
      string sql = @"
        SELECT * FROM vw_All_Tax_Data
        WHERE PID = @PID
        ORDER BY DateAdded DESC";
      var dbArgs = new DynamicParameters();
      dbArgs.Add("@PID", PID);
      try
      {
        var ta = appConstants.Get_DB().Get_List<TaxAssessment>(sql, dbArgs);
        if (ta.Count() == 1)
        {
          return ta.First();
        }
        else
        {
          return null;
        }
      }
      catch (Exception ex)
      {
        appConstants.Log(ex);
        return null;
      }
    }

    public static List<TaxAssessment> getData(
      string filterOwner = "", string filterRoad = "", string filterParcel = "", 
      int filterDistrict = -1,string filterUseDesc = "", int filterBuildings = -1, 
      int filterCollected = -1, int filterAssessed = -1, string filterNotes = "",
      bool filterWorked = false,
      queryType qt = queryType.normal)
    {
      string sql = @"
        SELECT PID
              ,DataYear
              ,USECD
              ,usedesc
              ,TaxDist
              ,Total_Buildings
              ,Total_Features
              ,Total_Taxable
              ,Prev_DataYear
              ,ISNULL(Prev_usedesc, '') AS Prev_usedesc
              ,Prev_Total_Buildings
              ,Prev_Total_Features
              ,Prev_Total_Taxable
              ,Building_Units
              ,Collected_Units
              ,Assessed_Units
              ,Notes
              ,DateAdded
              ,STREET
              ,HOUSE_NO
              ,OWNER_NAME
              ,PIN_DSP
          FROM vw_All_Tax_Data";
      var sbSql = new StringBuilder();
      sbSql.AppendLine(sql);

      sbSql.AppendLine("WHERE 1 = 1 ");

      var dbArgs = new DynamicParameters();

      if (filterOwner.Length > 0) dbArgs.Add("@OWNER_NAME", "%" + filterOwner.ToUpper() + "%");
      if (filterRoad.Length > 0) dbArgs.Add("@STREET", "%" + filterRoad.ToUpper() + "%");
      if (filterParcel.Length > 0) dbArgs.Add("@PID", "%" + filterParcel.ToUpper() + "%");      
      if (filterUseDesc.Length > 0) dbArgs.Add("@USEDESC", "%" + filterUseDesc.ToUpper() + "%");
      if (filterDistrict > -1) dbArgs.Add("@TAXDIST", filterDistrict);
      if (filterBuildings > -1) dbArgs.Add("@Building_Units", filterBuildings);
      if (filterCollected > -1) dbArgs.Add("@Collected_Units", filterCollected);
      if (filterAssessed > -1) dbArgs.Add("@Assessed_Units", filterAssessed);
      if (filterNotes.Length > 0) dbArgs.Add("@Note", "%" + filterNotes.ToUpper() + "%");
      string[] stringVars = { "OWNER_NAME", "STREET", "PID", "USEDESC" };

      if (dbArgs.ParameterNames.Count() > 0)
      {
        var t = dbArgs.ParameterNames.ToArray();
        for (int i = 0; i < t.Length; i++)
        {
          sbSql.Append(" AND ");
          if (t[i] == "Note")
          {
            sbSql.Append(" PID IN (SELECT DISTINCT PID FROM TaxLog WHERE Note like @Note) ");
          }
          else
          {
            sbSql.Append(t[i].Replace("@", "")); // append the name first

            if (stringVars.Contains(t[i]))
            {
              // this is a string variable so we'll use like
              sbSql.Append(" LIKE @").AppendLine(t[i]);
            }
            else
            {
              sbSql.Append(" = @").AppendLine(t[i]);
            }
          }
        }
      }
      if (filterWorked)
      {
        sbSql.Append("AND PID NOT IN (SELECT DISTINCT PID FROM TaxLog WHERE YEAR(addedOn) = YEAR(GETDATE()) AND addedBy like '%CLAYBCC%') ");
      }
      switch(qt)
      {
        case queryType.difference_reclassified:
          sbSql.Append("AND PID IN (SELECT DISTINCT PID FROM TaxLog WHERE Note like '%Reclassified%') ");
          break;

        case queryType.difference_hardship:
          sbSql.Append("AND PID IN (SELECT DISTINCT PID FROM TaxLog WHERE (Note like '%HS%' OR Note like '%HX%') AND Note NOT LIKE '%CoDate%') ");
          break;

        case queryType.difference_veteran:
          sbSql.Append("AND PID IN (SELECT DISTINCT PID FROM TaxLog WHERE Note like '%VX%' AND Note NOT LIKE '%CoDate%') ");
          break;

        case queryType.difference_build_assessed:
          sbSql.Append("AND Building_Units <> Assessed_Units AND USEDESC <> 'Condo' ");
          break;

        case queryType.difference_collected_assessed:
          sbSql.Append("AND Collected_Units <> Assessed_Units AND USEDESC <> 'Condo' ");
          break;

        case queryType.new_this_year:
          sbSql.AppendLine("AND (Prev_DataYear IS NULL")
            .AppendLine("OR (usedesc NOT LIKE '%vacant%' AND Prev_usedesc LIKE '%vacant%'))");
          break;

        case queryType.new_this_year_no_codate:
          sbSql.AppendLine("AND (Prev_DataYear IS NULL")
            .AppendLine("OR (usedesc NOT LIKE '%vacant%' AND Prev_usedesc LIKE '%vacant%'))")
            .AppendLine("AND PID NOT IN (SELECT DISTINCT PID FROM TaxLog WHERE Note LIKE '%CoDate%')");
          break;


        case queryType.removed_this_year:
          sbSql.AppendLine(" AND usedesc LIKE '%vacant%' AND Prev_usedesc NOT LIKE '%vacant%'")
            .AppendLine("UNION ALL")
            .AppendLine("SELECT * FROM vw_Parcel_Building_Data_Removed_This_Year");
          break;

        case queryType.difference_year_to_year:
          sbSql.AppendLine("AND Total_Taxable <> Prev_Total_Taxable");
          break;
      }
      sbSql.AppendLine("ORDER BY DateAdded DESC");
      
      try
      {
        return appConstants.Get_DB().Get_List<TaxAssessment>(sbSql.ToString(), dbArgs);
      }
      catch(Exception e)
      {
        appConstants.Log(e, sbSql.ToString());
        return new List<TaxAssessment>();
      }
      
    }

    public static List<TaxLog> getTaxLog(string parcel)
    {
      string sql = @"
        SELECT 
          id,
          PID,
          building_units,
          collected_units,
          assessed_units,
          Note,
          addedOn,
          ISNULL(addedBy, '') AS addedBy
        FROM TaxLog
          WHERE PID=@Parcel
          ORDER BY addedOn DESC";

      var d = new DynamicParameters();
      d.Add("@Parcel", parcel);

      try
      {
        return appConstants.Get_DB().Get_List<TaxLog>(sql, d);
      }
      catch(Exception e)
      {
        appConstants.Log(e);
        return new List<TaxLog>();
      }
      
    }
  }
}