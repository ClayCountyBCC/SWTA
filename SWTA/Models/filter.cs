using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SWTA.Models
{
  public class filter
  {
    public string filterOwner { get; set; } = "";
    public string filterRoad { get; set; } = "";
    public string filterParcel { get; set; } = "";
    public int filterDistrict { get; set; } = -1;
    public string filterUseDesc { get; set; } = "";
    public int filterBuildings { get; set; } = -1;
    public int filterCollected { get; set; } = -1;
    public int filterAssessed { get; set; } = -1;
    public TaxData.queryType qt { get; set; } = TaxData.queryType.normal;

    public filter()
    {

    }

  }
}