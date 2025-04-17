export const getSubjectsIncludes = () => {
  return {
    client_subjects: {
      include: {
        clients: false,
        subjects: false,
      },
    },
  };
};
