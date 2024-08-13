import axios from "axios";

// const url = 'http://10.10.0.33/api/method/gettasksacquisitions'
// export async function getData() {
//     return await axios.get(url)
// }

const projecturl = "http://10.10.0.33/api/method/acquiprojects"
export async function getData() {
    return await axios.get(projecturl)
}

const projectNewUrl = "http://10.10.0.33/api/method/gettasksofteams"
export async function getDataBasedOnTeam(team, id, stages) {
    return await axios.post(projectNewUrl, { team, id, stages })
}

const CheckSourcingUrl = "http://10.10.0.33/api/method/fetchsourcingdata"
export async function detailsCheckSourcing() {
    return await axios.get(CheckSourcingUrl)
}

const StatusUpadateUrl = "http://10.10.0.33/api/method/status_change_in_sourcing_child_table"
export async function updateSourcingStatus(name, sourcing_status) {
    return await axios.post(StatusUpadateUrl)
}

const updateTashURL = "http://10.10.0.33/api/method/task_update"
export async function updateTasks(updatedTasks) {
    return await axios.put(updateTashURL, { data: updatedTasks }, { withCredentials: true })
}

const usersURL = "http://10.10.0.33/api/method/get_users"
export async function getUsers() {
    return await axios.get(usersURL, { withCredentials: true })
}

const chatURL = "http://10.10.0.33/api/method/fetch_chat"
export async function getChat(name) {
    return await axios.post(chatURL, { data: { name: name } }, { withCredentials: true })
}
