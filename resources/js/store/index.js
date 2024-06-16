import {createStore} from "vuex";

import Notifications from './modules/notifications.ts';

export default createStore({
    modules: {
        Notifications,
    }
})