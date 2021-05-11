import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import memoryUtils from "../../utils/memoryUtils";

class Admin extends Component {
    render() {
        const user = memoryUtils.user
        if(!user || !user._id){
            return <Redirect to='/login'/>
        }
        return (
            <div>
              admin {user.username}
            </div>
        );
    }
}

export default Admin;
