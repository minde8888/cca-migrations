export const initializeConnection = async (dataSourcePromise) => {
  try {
    const dataSource = await dataSourcePromise;
    if (!dataSource.isInitialized) {
      console.log("Initializing DataSource...");
      await dataSource.initialize();
    }
    return dataSource.createQueryRunner();
  } catch (error) {
    console.error("Error initializing connection:", error);
    throw error;
  }
};

export const cleanup = async (dataSource, queryRunner) => {
  if (queryRunner) {
    await queryRunner.release();
  }
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
  }
};