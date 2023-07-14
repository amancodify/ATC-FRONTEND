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
