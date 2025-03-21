import axios from "axios";
import API_URL from "../../config";
import { get } from "lodash";

export const getGodownsMode = async () => {
    try {
        let response = await axios.get(`${API_URL}/godowns`);
        let formattedGodownsList = {};
        get(response, "data.data", []).forEach(
            (item) => (formattedGodownsList[item.godowncode] = item.godownname),
        );
        return formattedGodownsList;
    } catch (err) {
        console.log(err);
    }
};

// utils/storage.js
export const getStoredProducts = () => {
    try {
      const data = localStorage.getItem('products');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return {};
    }
  };

  export const getStoredTransMode = () => {
    try {
      const data = localStorage.getItem('transaction_modes');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return {};
    }
  };
    