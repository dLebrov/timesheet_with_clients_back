export const getSubjectsIncludes = () => {
  return {
    users: false,
    records: false,
    client_subjects: {
      include: {
        clients: false,
        subjects: false,
      },
    },
  };
};
