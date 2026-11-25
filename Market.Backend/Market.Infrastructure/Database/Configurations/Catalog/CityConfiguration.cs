namespace Market.Infrastructure.Database.Configurations.Catalog;

public class CityConfiguration : IEntityTypeConfiguration<CityEntity>
{
    public void Configure(EntityTypeBuilder<CityEntity> builder)
    {
        builder
            .ToTable("Cities");

        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(CityEntity.Constraints.NameMaxLength);

        builder
            .Property(x => x.IsEnabled)
            .IsRequired();
    }
}