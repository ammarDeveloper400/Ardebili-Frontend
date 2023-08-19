// const { urls } = "./Api_urls";
import { urls } from "./Api_urls";
export async function doPost(body_data:any,url_plus:any) {
    // console.log(" I request @ " + urls.API + url_plus);
    // console.log(body_data);
    const {isError, data} = await fetch(urls.API + url_plus, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body_data),
    }).then((response) => response.json())
      .then((responseJson) => {
        return {isError:false,data:responseJson}
      }).catch((error) => {
        // console.log(error);
        return {isError:true,data:error}
      });
    return {isError,data};
}
