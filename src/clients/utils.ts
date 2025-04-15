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
        subjects: false,
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
