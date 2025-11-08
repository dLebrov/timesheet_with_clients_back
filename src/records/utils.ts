export const getRecordsIncludes = () => {
  return {
    users: false,
    subjects: {
      include: {
        records: false,
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
