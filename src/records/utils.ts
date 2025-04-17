export const getRecordsIncludes = () => {
  return {
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
