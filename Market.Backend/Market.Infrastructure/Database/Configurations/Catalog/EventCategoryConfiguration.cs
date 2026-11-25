namespace Market.Infrastructure.Database.Configurations.Catalog;

public class EventCategoryConfiguration : IEntityTypeConfiguration<EventCategoryEntity>
{
    public void Configure(EntityTypeBuilder<EventCategoryEntity> builder)
    {
        builder
            .ToTable("EventCategories");

        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(EventCategoryEntity.Constraints.NameMaxLength);

        builder
            .Property(x => x.IsEnabled)
            .IsRequired();
    }
}