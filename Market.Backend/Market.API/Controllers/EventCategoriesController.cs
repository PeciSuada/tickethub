using Market.Application.Modules.Catalog.EventCategories.Commands.Delete;
using Market.Application.Modules.Catalog.EventCategories.Commands.Status.Disable;
using Market.Application.Modules.Catalog.EventCategories.Commands.Status.Enable;
using Market.Application.Modules.Catalog.EventCategories.Commands.Create;
using Market.Application.Modules.Catalog.EventCategories.Commands.Update;
using Market.Application.Modules.Catalog.EventCategories.Queries.GetById;
using Market.Application.Modules.Catalog.EventCategories.Queries.List;
using Market.Shared.Constants;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
public class EventCategoriesController(ISender sender) : ControllerBase
{
    [HttpPost]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task<ActionResult<int>> CreateEventCategory(CreateEventCategoryCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Update(int id, UpdateEventCategoryCommand command, CancellationToken ct)
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
        await sender.Send(new DeleteEventCategoryCommand { Id = id }, ct);
        // no return -> 204 No Content
    }

    [HttpGet("{id:int}")]
    public async Task<GetEventCategoryByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        var category = await sender.Send(new GetEventCategoryByIdQuery { Id = id }, ct);
        return category; // if NotFoundException -> 404 via middleware
    }

    // Public catalog: anonymous visitors can list categories (e.g. category filter on the public page).
    [HttpGet]
    [AllowAnonymous]
    public async Task<PageResult<ListEventCategoriesQueryDto>> List([FromQuery] ListEventCategoriesQuery query, CancellationToken ct)
    {
        var result = await sender.Send(query, ct);
        return result;
    }

    [HttpPut("{id:int}/disable")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Disable(int id, CancellationToken ct)
    {
        await sender.Send(new DisableEventCategoryCommand { Id = id }, ct);
        // no return -> 204 No Content
    }

    [HttpPut("{id:int}/enable")]
    [Authorize(Policy = PolicyNames.Admin)]
    public async Task Enable(int id, CancellationToken ct)
    {
        await sender.Send(new EnableEventCategoryCommand { Id = id }, ct);
        // no return -> 204 No Content
    }
}