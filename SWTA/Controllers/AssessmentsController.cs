using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SWTA.Models;

namespace SWTA.Controllers
{
  public class AssessmentsController : ApiController
  {
    // GET: api/Assessments
    //    [Route("api/Assessments/")]
    public List<TaxAssessment> Get([FromUri] string owner = "",
      [FromUri] string road = "", [FromUri] string parcel = "",
      [FromUri] int district = -1, [FromUri] string usedesc = "",
      [FromUri] int buildings = -1, [FromUri] int collected = -1,
      [FromUri] int assessed = -1, [FromUri] string notes = "",
      [FromUri] bool alreadyworked = false, [FromUri] int querytype = 0)
    {
      return TaxAssessment.Get(owner, road, parcel, district,
        usedesc, buildings, collected, assessed, notes, alreadyworked,
        (appConstants.queryType)querytype);
    }

    public TaxAssessment Get(string PID)
    {
      return TaxAssessment.Get(PID);
    }

    // POST: api/Assessments
    public IHttpActionResult Post(TaxAssessment ta)
    {
      ta.Username = User.Identity.Name;
      if (ta.Save())
      {
        return Ok();
      }
      else
      {
        return InternalServerError();
      }
    }

  }
}
