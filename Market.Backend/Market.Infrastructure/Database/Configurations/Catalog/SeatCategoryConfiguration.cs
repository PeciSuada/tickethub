namespace Market.Infrastructure.Database.Configurations.Catalog;

public class SeatCategoryConfiguration : IEntityTypeConfiguration<SeatCategoryEntity>
{
    public void Configure(EntityTypeBuilder<SeatCategoryEntity> builder)
    {
        builder
            .ToTable("SeatCategories");

        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(SeatCategoryEntity.Constraints.NameMaxLength);

        builder
            .Property(x => x.ColorHex)
            .IsRequired()
            .HasMaxLength(SeatCategoryEntity.Constraints.ColorHexLength);

        builder
            .Property(x => x.IsEnabled)
            .IsRequired();
    }
}