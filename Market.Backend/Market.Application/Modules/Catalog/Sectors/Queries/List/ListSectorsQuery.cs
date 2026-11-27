namespace Market.Application.Modules.Catalog.Sectors.Queries.List;

public sealed class ListSectorsQuery : BasePagedQuery<ListSectorsQueryDto>
{
    public string? Search { get; init; }
    public int? VenueId { get; init; }
    public bool? OnlyEnabled { get; init; }
}