export const getClientIncludes = () => {
  return {
    users: {
      include: {
        clients: false,
        services: false,
        password: false,
      },
    },
    client_subjects: {
      include: {
        clients: false,
        subjects: true,
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
