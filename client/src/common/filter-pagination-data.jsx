import axios from "axios";

export const filterPaginationData = async ({
                                               create_new_arr = false,
                                               state,
                                               data,
                                               page,
                                               countRoute,
                                               data_to_send = {}
                                           }) => {
    let obj = {
        results: [],
        page: page || 1,
        totalDocs: 0,
        totalPages: 1,
        user_id: null, // Add user_id to default structure
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
                console.log("Fetching count from:", import.meta.env.VITE_SERVER_DOMAIN + countRoute, "with data:", data_to_send); // Debug log
                const {data: {totalDocs} = {totalDocs: 0}} = await axios.post(
                    import.meta.env.VITE_SERVER_DOMAIN + countRoute,
                    data_to_send
                );
                obj.totalDocs = totalDocs;
                obj.totalPages = Math.ceil(totalDocs / 5); // Assuming limit of 5 per page
            }
        }
    } catch (err) {
        console.error("Error in filterPaginationData:", err.message, err.response?.data, "Route:", countRoute, "Data sent:", data_to_send);
        // Keep default obj with empty results on error, ensuring user_id is null
    }

    return obj; // Ensure obj is always returned
};