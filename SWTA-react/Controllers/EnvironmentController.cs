using System.Web.Http;
using SolidWasteTaxAssessmentReact.Models;

namespace SolidWasteTaxAssessmentReact.Controllers
{
  public class EnvironmentController : ApiController
  {
    /// <summary>
    /// Returns the current deployment classification so the UI can show the development banner only off production.
    /// </summary>
    [HttpGet]
    public IHttpActionResult Get()
    {
      return Ok(new
      {
        isProduction = appConstants.isProduction
      });
    }
  }
}
