import axios from 'axios';


const api = axios.create({
    baseURL: "http://localhost:81"//process.env.API_PROCESSCONTROL
});

class HttpRequest {
    async get(url,query={}) {
            return await api.get(url,{
                params: query,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${window.localStorage.getItem('token-processcontrol') ?? ''}`
                }
            }) 
    }

    async post(url,body={}) {
        return await api.post(url,body,{headers:{
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${window.localStorage.getItem('token-processcontrol') ?? ''}`
        }})
    }

    async put(url,body={}) {
        return await api.put(url,body,{headers:{
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${window.localStorage.getItem('token-processcontrol') ?? ''}`
        }})
    }
}

export default new HttpRequest();
