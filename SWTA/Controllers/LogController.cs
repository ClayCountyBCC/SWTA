using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SWTA.Models;

namespace SWTA.Controllers
{
  public class LogController : ApiController
  {

    // GET: api/Log/5
    public List<TaxLog> Get(string id)
    {
      return TaxData.getTaxLog(id);
    }

    // POST: api/Log
    public void Post(TaxLog t)
    {
    }

    // PUT: api/Log/5
    //public void Put(int id, [FromBody]string value)
    //{
    //}


  }
}
