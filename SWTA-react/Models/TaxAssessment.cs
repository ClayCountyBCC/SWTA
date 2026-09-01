using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace SolidWasteTaxAssessmentReact.Models
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
    public bool HasHardshipExemption { get; set; }
    public bool HasVeteranExemption { get; set; }
    
    // previous parcel data
    public int? Prev_DataYear { get; set; }
    public string Prev_USEDESC { get; set; } = "";
    public int? Prev_Total_Buildings { get; set; }
    public int? Prev_Total_Features { get; set; }
    public int? Prev_Total_Taxable { get; set; }
    // the currently logged in user
    public string Username { get; set; } = "";
    public string ExemptionType { get; set; } = "";
    public bool RemoveExemption { get; set; }



    public TaxAssessment()
    {

    }

    public bool Save()
    {
      var exemptionType = (ExemptionType ?? string.Empty).Trim().ToUpperInvariant();
      var savesExemption = exemptionType == "HS" || exemptionType == "VX";
      var param = new DynamicParameters();

      param.Add("@PID", PID);
      param.Add("@exemption_type", savesExemption ? exemptionType : null);
      // The app applies the exemption row change directly before the stored procedure runs.
      // Keep these flags off so an older deployed procedure cannot reinsert the row.
      param.Add("@save_exemption", 0);
      param.Add("@remove_exemption", 0);
      param.Add("@DataYear", DataYear);
      param.Add("@Building_Units", Building_Units);
      param.Add("@Collected_Units", Collected_Units);
      param.Add("@Assessed_Units", Assessed_Units);
      param.Add("@Notes", Notes);
      param.Add("@Username", Username);

      string sql = @"
      EXEC [sp_update_parcel]
        @PID,
        @exemption_type,
        @save_exemption,
        @remove_exemption,
        @DataYear,
        @Building_Units,
        @Collected_Units,
        @Assessed_Units,
        @Notes,
        @Username;";

      try
      {
        using (IDbConnection db = new SqlConnection(appConstants.Get_ConnStr()))
        {
          db.Open();

          using (var transaction = db.BeginTransaction())
          {
            // Apply the exemption row directly so the removal path still works if the deployed stored procedure is older than the repo script.
            if (savesExemption)
            {
              if (RemoveExemption)
              {
                const string removeExemptionSql = @"
                  DELETE FROM ParcelExemptions
                  WHERE PID = @PID
                    AND LTRIM(RTRIM(UPPER(ExemptionType))) = @ExemptionType
                    AND ExemptionYear = @DataYear;";

                db.Execute(removeExemptionSql, new
                {
                  PID,
                  ExemptionType = exemptionType,
                  DataYear
                }, transaction);
              }
              else
              {
                const string addExemptionSql = @"
                  IF NOT EXISTS (
                    SELECT 1
                    FROM ParcelExemptions
                    WHERE PID = @PID
                      AND LTRIM(RTRIM(UPPER(ExemptionType))) = @ExemptionType
                      AND ExemptionYear = @DataYear
                  )
                  BEGIN
                    INSERT INTO ParcelExemptions (
                      PID,
                      ExemptionType,
                      ExemptionYear
                    )
                    VALUES (
                      @PID,
                      @ExemptionType,
                      @DataYear
                    );
                  END";

                db.Execute(addExemptionSql, new
                {
                  PID,
                  ExemptionType = exemptionType,
                  DataYear
                }, transaction);
              }
            }

            // The stored procedure still handles the assessment row and the tax log entry.
            db.Execute(sql, param, transaction);
            transaction.Commit();
          }

          return true;
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
        SELECT
          td.*
          ,CASE WHEN EXISTS (
            SELECT 1
            FROM ParcelExemptions pe
            WHERE pe.PID = td.PID
              AND UPPER(pe.ExemptionType) IN ('HS', 'HX')
              AND pe.ExemptionYear = td.DataYear
          ) THEN CAST(1 AS bit) ELSE CAST(0 AS bit) END AS HasHardshipExemption
          ,CASE WHEN EXISTS (
            SELECT 1
            FROM ParcelExemptions pe
            WHERE pe.PID = td.PID
              AND UPPER(pe.ExemptionType) = 'VX'
              AND pe.ExemptionYear = td.DataYear
          ) THEN CAST(1 AS bit) ELSE CAST(0 AS bit) END AS HasVeteranExemption
        FROM vw_All_Tax_Data td
        WHERE td.PID = @PID
        ORDER BY td.DateAdded DESC";
      var dbArgs = new DynamicParameters();
      dbArgs.Add("@PID", PID);
      try
      {
        using (IDbConnection db = new SqlConnection(appConstants.Get_ConnStr()))
        {
          var l = db.Query<TaxAssessment>(sql, dbArgs);
          return l.FirstOrDefault();
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
      var query = BuildAssessmentQuery(
        filterOwner,
        filterRoad,
        filterParcel,
        filterDistrict,
        filterUseDesc,
        filterBuildings,
        filterCollected,
        filterAssessed,
        filterNotes,
        filterWorked,
        qt);
      var sql = BuildAssessmentSelect(query.Sql) + " ORDER BY base.DateAdded DESC";

      try
      {
        using (IDbConnection db = new SqlConnection(appConstants.Get_ConnStr()))
        {
          return db.Query<TaxAssessment>(sql, query.Parameters).ToList();
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, sql);
        return null;
      }
    }

    /// <summary>
    /// Returns one filtered page of assessment records and the total number of matching records.
    /// The page query keeps the existing filter behavior while limiting the result sent to the browser.
    /// </summary>
    public static TaxAssessmentPage GetPage(
      string filterOwner = "", string filterRoad = "", string filterParcel = "",
      int filterDistrict = -1, string filterUseDesc = "", int filterBuildings = -1,
      int filterCollected = -1, int filterAssessed = -1, string filterNotes = "",
      bool filterWorked = false,
      appConstants.queryType qt = appConstants.queryType.normal,
      int page = 1,
      int pageSize = 50,
      bool includeTotalCount = true)
    {
      page = Math.Max(1, page);
      pageSize = Math.Max(1, Math.Min(100, pageSize));

      var query = BuildAssessmentQuery(
        filterOwner,
        filterRoad,
        filterParcel,
        filterDistrict,
        filterUseDesc,
        filterBuildings,
        filterCollected,
        filterAssessed,
        filterNotes,
        filterWorked,
        qt);
      var pageSql = BuildAssessmentSelect(query.Sql) + @"
        ORDER BY base.DateAdded DESC
        OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";
      var offset = (page - 1) * pageSize;
      query.Parameters.Add("@Offset", offset);
      // Fetch one extra row so page navigation can determine whether another
      // page exists without running a full count query for every click.
      query.Parameters.Add("@PageSize", pageSize + 1);

      try
      {
        using (IDbConnection db = new SqlConnection(appConstants.Get_ConnStr()))
        {
          var fetchedItems = db.Query<TaxAssessment>(pageSql, query.Parameters).ToList();
          var hasNextPage = fetchedItems.Count > pageSize;
          var items = fetchedItems.Take(pageSize).ToList();
          int? totalCount = null;

          if (includeTotalCount)
          {
            var countSql = "SELECT COUNT(1) FROM (" + query.Sql + ") base";
            totalCount = db.ExecuteScalar<int>(countSql, query.Parameters);
          }

          return new TaxAssessmentPage
          {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            HasNextPage = hasNextPage,
            HasPreviousPage = page > 1
          };
        }
      }
      catch (Exception ex)
      {
        new ErrorLog(ex, pageSql);
        return null;
      }
    }

    private static AssessmentQuery BuildAssessmentQuery(
      string filterOwner,
      string filterRoad,
      string filterParcel,
      int filterDistrict,
      string filterUseDesc,
      int filterBuildings,
      int filterCollected,
      int filterAssessed,
      string filterNotes,
      bool filterWorked,
      appConstants.queryType qt)
    {
      filterOwner = filterOwner ?? "";
      filterRoad = filterRoad ?? "";
      filterParcel = filterParcel ?? "";
      filterUseDesc = filterUseDesc ?? "";
      filterNotes = filterNotes ?? "";

      string selectColumns = @"
        SELECT
          td.PID
          ,td.DataYear
          ,td.USECD
          ,td.usedesc
          ,td.TaxDist
          ,td.Total_Buildings
          ,td.Total_Features
          ,td.Total_Taxable
          ,td.Prev_DataYear
          ,ISNULL(td.Prev_usedesc, '') AS Prev_usedesc
          ,td.Prev_Total_Buildings
          ,td.Prev_Total_Features
          ,td.Prev_Total_Taxable
          ,td.Building_Units
          ,td.Collected_Units
          ,td.Assessed_Units
          ,td.Notes
          ,td.DateAdded
          ,td.STREET
          ,td.HOUSE_NO
          ,td.OWNER_NAME
          ,td.PIN_DSP
        FROM vw_All_Tax_Data td";
      var sbSql = new StringBuilder();
      sbSql.AppendLine(selectColumns);
      sbSql.AppendLine("WHERE 1 = 1 ");

      var dbArgs = new DynamicParameters();

      if (filterOwner.Length > 0)
      {
        dbArgs.Add("@OWNER_NAME", "%" + filterOwner.ToUpper() + "%");
        sbSql.Append("AND td.OWNER_NAME LIKE @OWNER_NAME ");
      }
      if (filterRoad.Length > 0)
      {
        dbArgs.Add("@STREET", "%" + filterRoad.ToUpper() + "%");
        sbSql.Append("AND td.STREET LIKE @STREET ");
      }
      if (filterParcel.Length > 0)
      {
        dbArgs.Add("@PID", "%" + filterParcel.ToUpper() + "%");
        sbSql.Append("AND td.PID LIKE @PID ");
      }
      if (filterUseDesc.Length > 0)
      {
        dbArgs.Add("@USEDESC", "%" + filterUseDesc.ToUpper() + "%");
        sbSql.Append("AND td.USEDESC LIKE @USEDESC ");
      }
      if (filterDistrict > -1)
      {
        dbArgs.Add("@TAXDIST", filterDistrict);
        sbSql.Append("AND td.TAXDIST = @TAXDIST ");
      }
      if (filterBuildings > -1)
      {
        dbArgs.Add("@Building_Units", filterBuildings);
        sbSql.Append("AND td.Building_Units = @Building_Units ");
      }
      if (filterCollected > -1)
      {
        dbArgs.Add("@Collected_Units", filterCollected);
        sbSql.Append("AND td.Collected_Units = @Collected_Units ");
      }
      if (filterAssessed > -1)
      {
        dbArgs.Add("@Assessed_Units", filterAssessed);
        sbSql.Append("AND td.Assessed_Units = @Assessed_Units ");
      }
      if (filterNotes.Length > 0)
      {
        dbArgs.Add("@Note", "%" + filterNotes.ToUpper() + "%");
        sbSql.Append(" AND td.PID IN (SELECT DISTINCT PID FROM TaxLog WHERE Note like @Note) ");
      }

      if (filterWorked)
      {
        sbSql.Append("AND td.PID NOT IN (SELECT DISTINCT PID FROM TaxLog WHERE YEAR(addedOn) = YEAR(GETDATE()) AND addedBy like '%CLAYBCC%') ");
      }
      switch (qt)
      {
        case appConstants.queryType.difference_reclassified:
          sbSql.Append("AND td.PID IN (SELECT DISTINCT PID FROM TaxLog WHERE Note like '%Reclassified%' AND YEAR(addedOn) >= dbo.GetMaxYear() - 1) ");
          break;

        case appConstants.queryType.difference_hardship:
          sbSql.Append("AND td.PID IN (SELECT DISTINCT PID FROM ParcelExemptions WHERE UPPER(ExemptionType) IN ('HS', 'HX') AND ExemptionYear = td.DataYear) ");
          break;

        case appConstants.queryType.difference_veteran:
          sbSql.Append("AND td.PID IN (SELECT DISTINCT PID FROM ParcelExemptions WHERE UPPER(ExemptionType) = 'VX' AND ExemptionYear = td.DataYear) ");
          break;

        case appConstants.queryType.difference_build_assessed:
          sbSql.Append("AND td.Building_Units <> td.Assessed_Units AND td.USEDESC <> 'Condo' ");
          break;

        case appConstants.queryType.difference_collected_assessed:
          sbSql.Append("AND td.Collected_Units <> td.Assessed_Units AND td.USEDESC <> 'Condo' ");
          break;

        case appConstants.queryType.new_this_year:
          sbSql.AppendLine("AND (td.Prev_DataYear IS NULL")
            .AppendLine("OR (td.usedesc NOT LIKE '%vacant%' AND td.Prev_usedesc LIKE '%vacant%'))");
          break;

        case appConstants.queryType.new_this_year_no_codate:
          sbSql.AppendLine("AND (td.Prev_DataYear IS NULL")
            .AppendLine("OR (td.usedesc NOT LIKE '%vacant%' AND td.Prev_usedesc LIKE '%vacant%'))")
            .AppendLine("AND td.PID NOT IN (SELECT DISTINCT PID FROM TaxLog WHERE Note LIKE '%CoDate%')");
          break;

        case appConstants.queryType.removed_this_year:
          sbSql.AppendLine(" AND td.usedesc LIKE '%vacant%' AND td.Prev_usedesc NOT LIKE '%vacant%'")
            .AppendLine("UNION ALL")
            .AppendLine("SELECT * FROM vw_Parcel_Building_Data_Removed_This_Year");
          break;

        case appConstants.queryType.difference_year_to_year:
          sbSql.AppendLine("AND td.Total_Taxable <> td.Prev_Total_Taxable");
          break;
      }

      return new AssessmentQuery
      {
        Sql = sbSql.ToString(),
        Parameters = dbArgs
      };
    }

    private static string BuildAssessmentSelect(string sourceSql)
    {
      return @"
        SELECT
          base.*
          ,CASE WHEN EXISTS (
            SELECT 1
            FROM ParcelExemptions pe
            WHERE pe.PID = base.PID
              AND UPPER(pe.ExemptionType) IN ('HS', 'HX')
              AND pe.ExemptionYear = base.DataYear
          ) THEN CAST(1 AS bit) ELSE CAST(0 AS bit) END AS HasHardshipExemption
          ,CASE WHEN EXISTS (
            SELECT 1
            FROM ParcelExemptions pe
            WHERE pe.PID = base.PID
              AND UPPER(pe.ExemptionType) = 'VX'
              AND pe.ExemptionYear = base.DataYear
          ) THEN CAST(1 AS bit) ELSE CAST(0 AS bit) END AS HasVeteranExemption
        FROM (" + sourceSql + ") base";
    }

    private sealed class AssessmentQuery
    {
      public string Sql { get; set; }
      public DynamicParameters Parameters { get; set; }
    }
  }
}
