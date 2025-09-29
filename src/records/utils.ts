export const getRecordsIncludes = () => {
  return {
    users: {
      include: {
        services: false,
        clients: false,
      },
    },
    clients: {
      include: {
        records: false,
        client_subjects: false,
        users: false,
      },
    },
    services: {
      include: {
        records: false,
        users: false,
      },
    },
  };
};
