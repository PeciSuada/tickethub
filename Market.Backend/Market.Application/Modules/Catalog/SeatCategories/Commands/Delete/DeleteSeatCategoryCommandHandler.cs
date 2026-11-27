namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Delete;

public class DeleteSeatCategoryCommandHandler(IAppDbContext context, IAppCurrentUser appCurrentUser)
      : IRequestHandler<DeleteSeatCategoryCommand, Unit>
{
    public async Task<Unit> Handle(DeleteSeatCategoryCommand request, CancellationToken cancellationToken)
    {
        // Defense in depth: the endpoint is already protected by the "Admin" policy.
        if (!appCurrentUser.IsAdmin)
            throw new MarketForbiddenException("Samo administrator može brisati kategorije sjedišta.");

        var category = await context.SeatCategories
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (category is null)
            throw new MarketNotFoundException("Kategorija nije pronađena.");

        var isUsed = await context.Seats
            .AnyAsync(s => s.SeatCategoryId == category.Id, cancellationToken);

        if (isUsed)
            throw new MarketConflictException(
                $"Kategorija sjedi\u0161ta {category.Name} se ne mo\u017ee obrisati jer je koriste sjedi\u0161ta.");

        context.SeatCategories.Remove(category);
        await context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
