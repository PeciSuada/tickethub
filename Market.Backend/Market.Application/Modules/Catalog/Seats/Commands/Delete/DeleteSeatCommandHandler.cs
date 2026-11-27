namespace Market.Application.Modules.Catalog.Seats.Commands.Delete;

public class DeleteSeatCommandHandler(IAppDbContext context, IAppCurrentUser appCurrentUser)
      : IRequestHandler<DeleteSeatCommand, Unit>
{
    public async Task<Unit> Handle(DeleteSeatCommand request, CancellationToken cancellationToken)
    {
        // Defense in depth: the endpoint is already protected by the "Admin" policy.
        if (!appCurrentUser.IsAdmin)
            throw new MarketForbiddenException("Samo administrator može brisati sjedišta.");

        var seat = await context.Seats
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (seat is null)
            throw new MarketNotFoundException("Sjedište nije pronađeno.");

        context.Seats.Remove(seat);
        await context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
