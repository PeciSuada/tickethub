namespace Market.Application.Modules.Catalog.EventCategories.Commands.Delete;

public class DeleteEventCategoryCommandHandler(IAppDbContext context, IAppCurrentUser appCurrentUser)
      : IRequestHandler<DeleteEventCategoryCommand, Unit>
{
    public async Task<Unit> Handle(DeleteEventCategoryCommand request, CancellationToken cancellationToken)
    {
        // Defense in depth: the endpoint is already protected by the "Admin" policy.
        if (!appCurrentUser.IsAdmin)
            throw new MarketForbiddenException("Samo administrator može brisati kategorije.");

        var category = await context.EventCategories
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (category is null)
            throw new MarketNotFoundException("Kategorija nije pronađena.");

        context.EventCategories.Remove(category);
        await context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
