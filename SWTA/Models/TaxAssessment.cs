using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Data;
using System.Data.SqlClient;

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
      //try
      //{
      //  SqlParameter[] p =
      //  {
      //    new SqlParameter("@PID", System.Data.SqlDbType.VarChar, 30) {Value = pa.PID },
      //    new SqlParameter("@N", System.Data.SqlDbType.VarChar, 0) {Value = pa.Notes },
      //    new SqlParameter("@BU", System.Data.SqlDbType.Int) {Value = pa.Building_Units },
      //    new SqlParameter("@CU", System.Data.SqlDbType.Int) {Value = pa.Collected_Units },
      //    new SqlParameter("@AU", System.Data.SqlDbType.Int) {Value = pa.Assessed_Units },
      //    new SqlParameter("@Username", System.Data.SqlDbType.VarChar, 50) {Value = username }
      //  };

      //  int i = appConstants.Get_DB().ExecuteNonQuery(sql, p);
      //  return i > 0;
      //}
      //catch(Exception ex)
      //{
      //  appConstants.Log(ex);
      //  return false;
      //}

    }

  }
}