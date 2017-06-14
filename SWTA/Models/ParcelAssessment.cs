using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SWTA.Models
{
  public class ParcelAssessment
  {
    public string DataYear { get; set; } = "";
    public string PID { get; set; }
    public string OWNER_NAME { get; set; }
    public string USEDESC { get; set; }
    public int TAXDIST { get; set; }
    public string HOUSE_NO { get; set; }
    public string STREET { get; set; }
    public string Notes { get; set; } = "";
    public int Building_Units { get; set; }
    public int Collected_Units { get; set; }
    public int Assessed_Units { get; set; }

    public ParcelAssessment()
    {

    }


  }
}