import {nextTick} from "vue";
import router from "./index.js";
import axios from "axios";

export const middleware = (to, from, next) => {
    if(process.env.NODE_ENV !== 'development') {
        router.push('/');
    }

    axios.get('http://localhost:5132/api/account/get', {
        withCredentials: true
    })
        .then((response) => {
            console.log(response.data);
            if(response.data.user.id) {
                next();
            } else {
                router.push('/');
            }
        })
        .catch((error) => {
            router.push('/');
        })

}