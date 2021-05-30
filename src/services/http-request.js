import axios from 'axios';


const api = axios.create({
    baseURL: "http://localhost:81"//process.env.API_PROCESSCONTROL
});

class HttpRequest {
    async get(url,query={}) {
            return await api.get(url,{
                params: query
            })
    }

    async post(url,body={}) {
        return await api.post(url,body)
    }

    async put(url,body={}) {
        return await api.put(url,body)
    }
}

export default new HttpRequest();
