import Vue from 'vue'

import {
    Message,
    Tree,
    Button,
} from 'view-design';

Vue.prototype.$Message = Message
Vue.component('Tree', Tree);
Vue.component('Button', Button);
