export const getClient_subjectsIncludes = () => {
  return {
    clients: {
      include: {
        client_subjects: false,
        records: false,
        users: false,
      },
    },
    subjects: {
      include: {
        client_subjects: false,
      },
    },
  };
};
