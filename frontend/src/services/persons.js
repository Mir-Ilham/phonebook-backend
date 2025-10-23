import axios from 'axios'
const baseUrl = '/api/persons'

const getAllPersons = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const createPerson = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const updatePerson = (personId, updatedPerson) => {
    const request = axios.put(`${baseUrl}/${personId}`, updatedPerson)
    return request.then(response => response.data)
}

const deletePerson = personId => {
    const request = axios.delete(`${baseUrl}/${personId}`)
    return request.then(response => response.data)
}

export default { getAllPersons, createPerson, updatePerson, deletePerson }