using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace SWTA.Models
{
  public class TaxAssessment
  {
    
    public string PID { get; set; } // Parcel #
    public string PIN_DSP { get; set; }
    public int DataYear { get; set; }    
    public string OWNER_NAME { get; set; }
    public string USEDESC { get; set; }
    public int TaxDist { get; set; }
    public string HOUSE_NO { get; set; }
    public string STREET { get; set; }
    public string Notes { get; set; } = "";    
    // Tax assessment data
    public int Building_Units { get; set; }
    public int Collected_Units { get; set; }
    public int Assessed_Units { get; set; }
    // parcel data
    public int Total_Buildings { get; set; }
    public int Total_Features { get; set; }
    public int Total_Taxable { get; set; }
    
    // previous parcel data
    public int? Prev_DataYear { get; set; }
    public string Prev_USEDESC { get; set; } = "";
    public int? Prev_Total_Buildings { get; set; }
    public int? Prev_Total_Features { get; set; }
    public int? Prev_Total_Taxable { get; set; }
    // the currently logged in user
    public string Username { get; set; } = "";



    public TaxAssessment()
    {

    }

    public bool Save()
    {
      // need to update the notes table
      // and the taxassessment table
      string sql = @"
      DELETE FROM TaxAssessmentData WHERE PID=@PID;
      INSERT INTO TaxAssessmentData (
        PID, 
        Building_Units, 
        Collected_Units, 
        Assessed_Units, 
        Notes, 
        UpdatedBy
      ) 
      VALUES (
        @PID, 
        @Building_Units, 
        @Collected_Units, 
        @Assessed_Units, 
        @Notes, 
        @Username
      );

      INSERT INTO TaxLog (
        PID, 
        building_units, 
        collected_units, 
        assessed_units, 
        Note, 
        addedBy
      ) 
      VALUES (
        @PID, 
        @Building_Units, 
        @Collected_Units, 
        @Assessed_Units, 
        @Notes, 
        @Username
      );";
      try
      {
        using (IDbConnection db = new SqlConnection(appConstants.Get_ConnStr()))
        {
          int i = db.Execute(sql, this);
          return i > 0;
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, sql);
        return false;
      }
    }

    public static TaxAssessment Get(string PID)
    {
      string sql = @"
        SELECT * FROM vw_All_Tax_Data
        WHERE PID = @PID
        ORDER BY DateAdded DESC";
      var dbArgs = new DynamicParameters();
      dbArgs.Add("@PID", PID);
      try
      {
        using (IDbConnection db = new SqlConnection(appConstants.Get_ConnStr()))
        {
          var l = db.Query<TaxAssessment>(sql, dbArgs);
          return l.Count() == 1 ? l.First() : null;
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, sql);
        return null;
      }

    }

    public static List<TaxAssessment> Get(
      string filterOwner = "", string filterRoad = "", string filterParcel = "",
      int filterDistrict = -1, string filterUseDesc = "", int filterBuildings = -1,
      int filterCollected = -1, int filterAssessed = -1, string filterNotes = "",
      bool filterWorked = false,
      appConstants.queryType qt = appConstants.queryType.normal)
    {
      string sql = @"
        SELECT 
          PID
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

      if (filterOwner.Length > 0)
      {
        dbArgs.Add("@OWNER_NAME", "%" + filterOwner.ToUpper() + "%");
        sbSql.Append("AND OWNER_NAME LIKE @OWNER_NAME ");
      }
      if (filterRoad.Length > 0)
      {
        dbArgs.Add("@STREET", "%" + filterRoad.ToUpper() + "%");
        sbSql.Append("AND STREET LIKE @STREET ");
      }
      if (filterParcel.Length > 0)
      {
        dbArgs.Add("@PID", "%" + filterParcel.ToUpper() + "%");
        sbSql.Append("AND PID LIKE @PID ");
      }
      if (filterUseDesc.Length > 0)
      {
        dbArgs.Add("@USEDESC", "%" + filterUseDesc.ToUpper() + "%");
        sbSql.Append("AND USEDESC LIKE @USEDESC ");
      }
      if (filterDistrict > -1)
      {
        dbArgs.Add("@TAXDIST", filterDistrict);
        sbSql.Append("AND TAXDIST = @TAXDIST ");
      }
      if (filterBuildings > -1)
      {
        dbArgs.Add("@Building_Units", filterBuildings);
        sbSql.Append("AND Building_Units = @Building_Units ");
      }
      if (filterCollected > -1)
      {
        dbArgs.Add("@Collected_Units", filterCollected);
        sbSql.Append("AND Collected_Units = @Collected_Units ");
      }
      if (filterAssessed > -1)
      {
        dbArgs.Add("@Assessed_Units", filterAssessed);
        sbSql.Append("AND Assessed_Units = @Assessed_Units ");
      }
      if (filterNotes.Length > 0)
      {
        dbArgs.Add("@Note", "%" + filterNotes.ToUpper() + "%");
        sbSql.Append(" AND PID IN (SELECT DISTINCT PID FROM TaxLog WHERE Note like @Note) ");
      }
      string[] stringVars = { "OWNER_NAME", "STREET", "PID", "USEDESC" };

      if (filterWorked)
      {
        sbSql.Append("AND PID NOT IN (SELECT DISTINCT PID FROM TaxLog WHERE YEAR(addedOn) = YEAR(GETDATE()) AND addedBy like '%CLAYBCC%') ");
      }
      switch (qt)
      {
        case appConstants.queryType.difference_reclassified:
          sbSql.Append("AND PID IN (SELECT DISTINCT PID FROM TaxLog WHERE Note like '%Reclassified%') ");
          break;

        case appConstants.queryType.difference_hardship:
          sbSql.Append("AND PID IN (SELECT DISTINCT PID FROM TaxLog WHERE (Note like '%HS%' OR Note like '%HX%') AND Note NOT LIKE '%CoDate%') ");
          break;

        case appConstants.queryType.difference_veteran:
          sbSql.Append("AND PID IN (SELECT DISTINCT PID FROM TaxLog WHERE Note like '%VX%' AND Note NOT LIKE '%CoDate%') ");
          break;

        case appConstants.queryType.difference_build_assessed:
          sbSql.Append("AND Building_Units <> Assessed_Units AND USEDESC <> 'Condo' ");
          break;

        case appConstants.queryType.difference_collected_assessed:
          sbSql.Append("AND Collected_Units <> Assessed_Units AND USEDESC <> 'Condo' ");
          break;

        case appConstants.queryType.new_this_year:
          sbSql.AppendLine("AND (Prev_DataYear IS NULL")
            .AppendLine("OR (usedesc NOT LIKE '%vacant%' AND Prev_usedesc LIKE '%vacant%'))");
          break;

        case appConstants.queryType.new_this_year_no_codate:
          sbSql.AppendLine("AND (Prev_DataYear IS NULL")
            .AppendLine("OR (usedesc NOT LIKE '%vacant%' AND Prev_usedesc LIKE '%vacant%'))")
            .AppendLine("AND PID NOT IN (SELECT DISTINCT PID FROM TaxLog WHERE Note LIKE '%CoDate%')");
          break;


        case appConstants.queryType.removed_this_year:
          sbSql.AppendLine(" AND usedesc LIKE '%vacant%' AND Prev_usedesc NOT LIKE '%vacant%'")
            .AppendLine("UNION ALL")
            .AppendLine("SELECT * FROM vw_Parcel_Building_Data_Removed_This_Year");
          break;

        case appConstants.queryType.difference_year_to_year:
          sbSql.AppendLine("AND Total_Taxable <> Prev_Total_Taxable");
          break;
      }
      sbSql.AppendLine("ORDER BY DateAdded DESC");

      try
      {
        using (IDbConnection db = new SqlConnection(appConstants.Get_ConnStr()))
        {
          return db.Query<TaxAssessment>(sbSql.ToString(), dbArgs).ToList();
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, sql);
        return null;
      }
    }
  }
}