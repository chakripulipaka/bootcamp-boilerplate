import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000"
})

export async function getPets() {
    const response = await api.get(`/api/pets`)
    if (response.status === 200){
        return response.data.data.pets
    } else {
        return
    }
}

export async function getPet(id: any) {
    const response = await api.get(`/api/pets/${id}`)
    if (response.status === 200){
        return response.data.data.pet
    } else {
        return
    }
}

export async function createPet(pet: any) {
    const response = await api.post(`/api/pets`, pet)
    return response
}

export async function updatePet(id: any, pet: any) {
    const response = await api.put(`/api/pets/${id}`, pet)
    return response
}

export async function deletePet(id : any) {
    const response = await api.delete(`/api/pets/${id}`)
    return response
}