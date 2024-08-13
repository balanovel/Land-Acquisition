import axios from "axios";


const GanttProjectUrl = "http://10.10.0.33/api/method/fetch_task_data"
export async function getData() {
    return await axios.get(GanttProjectUrl,
        { withCredentials: true }
    )

}




