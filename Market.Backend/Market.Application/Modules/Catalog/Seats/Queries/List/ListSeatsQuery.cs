namespace Market.Application.Modules.Catalog.Seats.Queries.List;

public sealed class ListSeatsQuery : BasePagedQuery<ListSeatsQueryDto>
{
    /// <summary>Row label contains this text (e.g. "A").</summary>
    public string? Search { get; init; }
    public int? SectorId { get; init; }
    public int? SeatCategoryId { get; init; }
    public bool? OnlyEnabled { get; init; }
}