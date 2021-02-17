import Vue from 'vue'

import {
    Message,
    Tree,
    Button,
    Dropdown,
    DropdownItem,
} from 'view-design';

Vue.prototype.$Message = Message
Vue.component('Tree', Tree);
Vue.component('Button', Button);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownItem', DropdownItem);
