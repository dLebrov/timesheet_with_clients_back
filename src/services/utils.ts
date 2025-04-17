export const getServicesIncludes = () => {
  return {
    users: {
      include: {
        clients: false,
        services: false,
      },
    },
    records: {
      include: {
        clients: false,
        services: false,
      },
    },
  };
};
