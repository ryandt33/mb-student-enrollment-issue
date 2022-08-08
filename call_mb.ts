import axios from "axios";

interface Error {
  response: {
    status: number;
    data: {
      errors: Array<string>;
    };
  };
}

const error_handling = async (
  tld: string,
  endpoint: string,
  api_key: string,
  query: {
    email: string;
  },
  error: Error,
  func: CallableFunction
) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 401) {
      throw { status: 401, error: "Invalid API Key" };
    } else if (status === 429) {
      console.log("Rate limit reached, waiting 30 seconds");
      await new Promise((resolve) => setTimeout(resolve, 30000));
      return await func(tld, endpoint, api_key, query);
    } else if (status === 422 && error.response.data.errors) {
      for (let key in error.response.data.errors) {
        if (key === "email") {
          console.log(error.response.data.errors[key]);
          const new_email_runner: string = `${query.email.split("@")}`;
          const new_email = !isNaN(parseInt(new_email_runner.slice(-1)))
            ? `${new_email_runner}${
                parseInt(new_email_runner.slice(-1)) + 1
              }@fake.email`
            : `${new_email_runner}1@fake.email`;
          return await func(tld, endpoint, api_key, {
            ...query,
            email: new_email,
          });
        }
      }
    } else {
      throw { status, error: "Server error" };
    }
  } else {
    throw { status: 500, error: "Unknown error" };
  }
};

export const get = async (tld: string, endpoint: string, api_key: string) => {
  const url = `https://api.managebac.${tld}/v2/${endpoint}`;
  console.log("GET " + url);

  try {
    const res = await axios.get(url, { headers: { "auth-token": api_key } });
    return res;
  } catch (error) {
    return await error_handling(tld, endpoint, api_key, null, error, get);
  }
};

export const post = async (tld, endpoint, api_key, query) => {
  const url = `https://api.managebac.${tld}/v2/${endpoint}`;
  console.log("POST " + url);
  console.log(query);

  try {
    const res = await axios.post(url, query, {
      headers: { "auth-token": api_key },
    });
    return res;
  } catch (error) {
    return await error_handling(tld, endpoint, api_key, query, error, post);
  }
};
