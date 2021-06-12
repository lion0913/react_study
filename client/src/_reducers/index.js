import {combineReducers} from "redux";
import user from './user_reducer';

//여러 state들을 rootReducer 하나로 합쳐주기 위해 combineReducers를 사용
const rootReducer = combineReducers({
    user

})

export default rootReducer;