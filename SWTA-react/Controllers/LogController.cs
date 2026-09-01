using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SolidWasteTaxAssessmentReact.Models;

namespace SolidWasteTaxAssessmentReact.Controllers
{
  public class LogController : ApiController
  {

    // GET: api/Log/5
    public List<TaxLog> Get(string id)
    {
      return TaxLog.Get(id);
    }   


  }
}
