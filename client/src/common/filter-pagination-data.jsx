import axios from "axios";

export const filterPaginationData = async ({create_new_arr = false, state, data, page, countRoute, data_to_send = {}}) => {
    let obj = {
        results: [],
        page: page || 1,
        totalDocs: 0,
        totalPages: 1,
    }; // Default object with empty results array

    try {
        if (state !== null && !create_new_arr) {
            // Merge existing state with new data
            obj = {
                ...state,
                results: [...(state.results || []), ...(data || [])], // Ensure arrays
                page: page,
            };
        } else {
            // Fetch total count and initialize new data
            if (data && Array.isArray(data)) {
                obj.results = data;
            } else {
                console.warn("Invalid data received, defaulting to empty array:", data);
                obj.results = [];
            }

            if (countRoute) {
                const { data: { totalDocs } = { totalDocs: 0 } } = await axios.post(
                    import.meta.env.VITE_SERVER_DOMAIN + countRoute,
                    data_to_send
                );
                obj.totalDocs = totalDocs;
                obj.totalPages = Math.ceil(totalDocs / 5); // Assuming limit of 5 per page
            }
        }
    } catch (err) {
        console.error("Error in filterPaginationData:", err.message);
        // Keep default obj with empty results on error
    }

    /*if(state !== null && !create_new_arr){
        obj = {...state, results: [...state.results, ...data], page: page}
    }
    else {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, data_to_send)
            .then(({data: {totalDocs}}) => {
                obj = {results: data, page: 1, totalDocs}
            })
            .catch(err => {
                console.log(err);
            })
    }*/
    return obj;
}