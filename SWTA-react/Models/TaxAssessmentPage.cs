using System.Collections.Generic;

namespace SolidWasteTaxAssessmentReact.Models
{
  /// <summary>
  /// Represents one page of parcel assessments returned to the React client.
  /// </summary>
  public class TaxAssessmentPage
  {
    public List<TaxAssessment> Items { get; set; } = new List<TaxAssessment>();
    // TotalCount is returned for a new search. Page navigation can omit the
    // expensive count query and use HasNextPage instead.
    public int? TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
  }
}
