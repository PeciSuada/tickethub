using Market.Application.Modules.Catalog.Seats.Commands.Delete;
using Market.Application.Modules.Catalog.Seats.Commands.Status.Disable;
using Market.Application.Modules.Catalog.Seats.Commands.Status.Enable;
using Market.Application.Modules.Catalog.Seats.Commands.Create;
using Market.Application.Modules.Catalog.Seats.Commands.Update;
using Market.Application.Modules.Catalog.Seats.Queries.GetById;
using Market.Application.Modules.Catalog.Seats.Queries.List;
using Market.Application.Modules.Catalog.Seats.Commands.Generate;
using Market.Shared.Constants;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
public class SeatsController(ISender sender) : ControllerBase
{
    [HttpPost]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task<ActionResult<int>> CreateSeat(CreateSeatCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Update(int id, UpdateSeatCommand command, CancellationToken ct)
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
        await sender.Send(new DeleteSeatCommand { Id = id }, ct);
        // no return -> 204 No Content
    }

    [HttpGet("{id:int}")]
    public async Task<GetSeatByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        var seat = await sender.Send(new GetSeatByIdQuery { Id = id }, ct);
        return seat; // if NotFoundException -> 404 via middleware
    }

    // Public catalog: anonymous visitors can list seats (e.g. seat filter on the public page).
    [HttpGet]
    [AllowAnonymous]
    public async Task<PageResult<ListSeatsQueryDto>> List([FromQuery] ListSeatsQuery query, CancellationToken ct)
    {
        var result = await sender.Send(query, ct);
        return result;
    }

    // Bulk creation: rows x seats per row in one transaction. Returns the number of created seats.
    [HttpPost("generate")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task<ActionResult<int>> Generate(GenerateSeatsCommand command, CancellationToken ct)
    {
        int created = await sender.Send(command, ct);
        return Ok(created);
    }

    [HttpPut("{id:int}/disable")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Disable(int id, CancellationToken ct)
    {
        await sender.Send(new DisableSeatCommand { Id = id }, ct);
        // no return -> 204 No Content
    }

    [HttpPut("{id:int}/enable")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Enable(int id, CancellationToken ct)
    {
        await sender.Send(new EnableSeatCommand { Id = id }, ct);
        // no return -> 204 No Content
    }
}