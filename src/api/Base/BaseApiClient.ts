import axios from "axios";

export const defaultHeders ={
    "Content-Type":"application/json",
};

export const AIPlaygroundApiClient= axios.create({
    baseURL:'http://localhost/api/',
     headers : defaultHeders,
    });