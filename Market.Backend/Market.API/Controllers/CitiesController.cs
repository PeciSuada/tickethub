using Market.Application.Modules.Catalog.Cities.Commands.Delete;
using Market.Application.Modules.Catalog.Cities.Commands.Status.Disable;
using Market.Application.Modules.Catalog.Cities.Commands.Status.Enable;
using Market.Application.Modules.Catalog.Cities.Commands.Create;
using Market.Application.Modules.Catalog.Cities.Commands.Update;
using Market.Application.Modules.Catalog.Cities.Queries.GetById;
using Market.Application.Modules.Catalog.Cities.Queries.List;
using Market.Shared.Constants;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
public class CitiesController(ISender sender) : ControllerBase
{
    [HttpPost]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task<ActionResult<int>> CreateCity(CreateCityCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Update(int id, UpdateCityCommand command, CancellationToken ct)
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
        await sender.Send(new DeleteCityCommand { Id = id }, ct);
        // no return -> 204 No Content
    }

    [HttpGet("{id:int}")]
    public async Task<GetCityByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        var city = await sender.Send(new GetCityByIdQuery { Id = id }, ct);
        return city; // if NotFoundException -> 404 via middleware
    }

    // Public catalog: anonymous visitors can list cities (e.g. city filter on the public page).
    [HttpGet]
    [AllowAnonymous]
    public async Task<PageResult<ListCitiesQueryDto>> List([FromQuery] ListCitiesQuery query, CancellationToken ct)
    {
        var result = await sender.Send(query, ct);
        return result;
    }

    [HttpPut("{id:int}/disable")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Disable(int id, CancellationToken ct)
    {
        await sender.Send(new DisableCityCommand { Id = id }, ct);
        // no return -> 204 No Content
    }

    [HttpPut("{id:int}/enable")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Enable(int id, CancellationToken ct)
    {
        await sender.Send(new EnableCityCommand { Id = id }, ct);
        // no return -> 204 No Content
    }
}