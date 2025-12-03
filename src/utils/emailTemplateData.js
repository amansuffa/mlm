

export const buildTemplateData = (user, extraData = {}) => {
  return {
    UnsubscribeToken: user.unsubscribeToken,

    ...extraData
  };
};
