using Market.Application.Modules.Catalog.Venues.Commands.Delete;
using Market.Application.Modules.Catalog.Venues.Commands.Status.Disable;
using Market.Application.Modules.Catalog.Venues.Commands.Status.Enable;
using Market.Application.Modules.Catalog.Venues.Commands.Create;
using Market.Application.Modules.Catalog.Venues.Commands.Update;
using Market.Application.Modules.Catalog.Venues.Queries.GetById;
using Market.Application.Modules.Catalog.Venues.Queries.List;
using Market.Shared.Constants;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
public class VenuesController(ISender sender) : ControllerBase
{
    [HttpPost]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task<ActionResult<int>> CreateVenue(CreateVenueCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Update(int id, UpdateVenueCommand command, CancellationToken ct)
    {
        // ID from the route takes precedence
        command.Id = id;
        await sender.Send(command, ct);
        // no return -> 204 No Content
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteVenueCommand { Id = id }, ct);
        // no return -> 204 No Content
    }

    [HttpGet("{id:int}")]
    public async Task<GetVenueByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        var venue = await sender.Send(new GetVenueByIdQuery { Id = id }, ct);
        return venue; // if NotFoundException -> 404 via middleware
    }

    // Public catalog: anonymous visitors can list venues (e.g. venue filter on the public page).
    [HttpGet]
    [AllowAnonymous]
    public async Task<PageResult<ListVenuesQueryDto>> List([FromQuery] ListVenuesQuery query, CancellationToken ct)
    {
        var result = await sender.Send(query, ct);
        return result;
    }

    [HttpPut("{id:int}/disable")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Disable(int id, CancellationToken ct)
    {
        await sender.Send(new DisableVenueCommand { Id = id }, ct);
        // no return -> 204 No Content
    }

    [HttpPut("{id:int}/enable")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Enable(int id, CancellationToken ct)
    {
        await sender.Send(new EnableVenueCommand { Id = id }, ct);
        // no return -> 204 No Content
    }
}