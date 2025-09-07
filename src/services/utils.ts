export const getServicesIncludes = () => {
  return {
    users: false,
    records: {
      include: {
        clients: false,
        services: false,
      },
    },
  };
};
