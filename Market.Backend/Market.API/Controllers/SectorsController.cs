using Market.Application.Modules.Catalog.Sectors.Commands.Delete;
using Market.Application.Modules.Catalog.Sectors.Commands.Status.Disable;
using Market.Application.Modules.Catalog.Sectors.Commands.Status.Enable;
using Market.Application.Modules.Catalog.Sectors.Commands.Create;
using Market.Application.Modules.Catalog.Sectors.Commands.Update;
using Market.Application.Modules.Catalog.Sectors.Queries.GetById;
using Market.Application.Modules.Catalog.Sectors.Queries.List;
using Market.Shared.Constants;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
public class SectorsController(ISender sender) : ControllerBase
{
    [HttpPost]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task<ActionResult<int>> CreateSector(CreateSectorCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Update(int id, UpdateSectorCommand command, CancellationToken ct)
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
        await sender.Send(new DeleteSectorCommand { Id = id }, ct);
        // no return -> 204 No Content
    }

    [HttpGet("{id:int}")]
    public async Task<GetSectorByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        var sector = await sender.Send(new GetSectorByIdQuery { Id = id }, ct);
        return sector; // if NotFoundException -> 404 via middleware
    }

    // Public catalog: anonymous visitors can list sectors (e.g. sector filter on the public page).
    [HttpGet]
    [AllowAnonymous]
    public async Task<PageResult<ListSectorsQueryDto>> List([FromQuery] ListSectorsQuery query, CancellationToken ct)
    {
        var result = await sender.Send(query, ct);
        return result;
    }

    [HttpPut("{id:int}/disable")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Disable(int id, CancellationToken ct)
    {
        await sender.Send(new DisableSectorCommand { Id = id }, ct);
        // no return -> 204 No Content
    }

    [HttpPut("{id:int}/enable")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Enable(int id, CancellationToken ct)
    {
        await sender.Send(new EnableSectorCommand { Id = id }, ct);
        // no return -> 204 No Content
    }
}