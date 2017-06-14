using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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
  }
}