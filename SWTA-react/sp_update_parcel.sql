ALTER PROCEDURE [dbo].[sp_update_parcel]
  @PID varchar(13),
  @exemption_type varchar(2) = NULL,
  @save_exemption BIT = 0,
  @remove_exemption BIT = 0,
  @DataYear int,
  @Building_Units int,
  @Collected_Units int,
  @Assessed_Units int,
  @Notes varchar(max),
  @Username varchar(100)
AS
BEGIN
  SET NOCOUNT ON;
  SET XACT_ABORT ON;

  DECLARE @dup_note BIT = 0;

  BEGIN TRY
    BEGIN TRANSACTION;

    -- Keep exemption rows and assessment data in sync so a failed save rolls back cleanly.
    IF @save_exemption = 1 AND @remove_exemption = 0
      AND @exemption_type IS NOT NULL
      AND LTRIM(RTRIM(@exemption_type)) <> ''
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM ParcelExemptions
        WHERE PID = @PID
          AND UPPER(ExemptionType) = UPPER(@exemption_type)
          AND ExemptionYear = @DataYear
      )
      BEGIN
        INSERT INTO ParcelExemptions
          (PID, ExemptionType, ExemptionYear)
        VALUES
          (@PID, UPPER(@exemption_type), @DataYear);
      END
    END
    ELSE IF @save_exemption = 1 AND @remove_exemption = 1
      AND @exemption_type IS NOT NULL
      AND LTRIM(RTRIM(@exemption_type)) <> ''
    BEGIN
      DELETE FROM ParcelExemptions
      WHERE PID = @PID
        AND UPPER(ExemptionType) = UPPER(@exemption_type)
        AND ExemptionYear = @DataYear;
    END

    DELETE FROM TaxAssessmentData
    WHERE PID = @PID;

    INSERT INTO TaxAssessmentData (
      PID,
      Building_Units,
      Collected_Units,
      Assessed_Units,
      Notes,
      UpdatedBy
    )
    VALUES (
      @PID,
      @Building_Units,
      @Collected_Units,
      @Assessed_Units,
      @Notes,
      @Username
    );

    ;WITH top_note AS (
      SELECT TOP 1
        PID,
        Building_Units,
        Collected_Units,
        Assessed_Units,
        Note,
        addedBy
      FROM TaxLog
      WHERE PID = @PID
      ORDER BY addedOn DESC
    )

    SELECT
      @dup_note = 1
    FROM top_note
    WHERE PID = @PID
      AND Building_Units = @Building_Units
      AND Collected_Units = @Collected_Units
      AND Assessed_Units = @Assessed_Units
      AND Note = @Notes
      AND addedBy = @Username;

    IF @dup_note = 0
    BEGIN
      INSERT INTO TaxLog (
        PID,
        building_units,
        collected_units,
        assessed_units,
        Note,
        addedBy
      )
      VALUES (
        @PID,
        @Building_Units,
        @Collected_Units,
        @Assessed_Units,
        @Notes,
        @Username
      );
    END

    COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0
    BEGIN
      ROLLBACK TRANSACTION;
    END

    ;THROW;
  END CATCH
END
GO
