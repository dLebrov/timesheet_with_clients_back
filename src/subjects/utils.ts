export const getSubjectsIncludes = () => {
  return {
    users: false,
    client_subjects: {
      include: {
        clients: false,
        subjects: false,
      },
    },
  };
};
