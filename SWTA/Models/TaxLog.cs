using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Data;
using System.Data.SqlClient;

namespace SWTA.Models
{
  public class TaxLog
  {
    public int id { get; set; }
    public string PID { get; set; }
    public string Note { get; set; }
    public int? building_units { get; set; }
    public int? collected_units { get; set; }
    public int? assessed_units { get; set; }
    public DateTime addedOn { get; set; }
    public string addedOn_string
    {
      get
      {
        return addedOn.ToString();
      }
    }
    public string addedBy { get; set; }

    public TaxLog()
    {

    }

    public static List<TaxLog> Get(string PID)
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
      d.Add("@PID", PID);

      try
      {
        using (IDbConnection db = new SqlConnection(appConstants.Get_ConnStr()))
        {
          return db.Query<TaxLog>(sql, d).ToList();
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