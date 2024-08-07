export const apiResponse = (data) => {
  return {
    data: {
      id: data.id,
      attributes: data,
      type: data.type,
    },
  };
};

export const apiResponses = (rawdata, data) => {
  return {
    data: rawdata.map((d) => {
      return {
        id: d.id,
        attributes: d,
        type: data.type,
      };
    }),
  };
};