// store/reducers/index.ts
import { Reducer } from 'redux';
// const rootReducer = combineReducers({
// 	auth: authSlice.reducer,
// });
export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const CHANGE_CONV = 'change conv';
export type TrootState = {
	// 상태의 인터페이스
	userData: {
		user_email: string;
		user_id: number;
		user_name: string;
		last_conv: number;
		profile_img: string;
	} | null;
	isLoggedIn: boolean;
};

const initialState: TrootState = {
	// 초기 상태
	userData: null,
	isLoggedIn: false,
};

const rootReducer: Reducer<TrootState, any> = (
	state: TrootState = initialState,
	action: any,
): TrootState => {
	switch (action.type) {
		case LOGIN:
		case LOGOUT:
			return {
				...state,
				...action.payload,
			};
		case CHANGE_CONV: {
			if (state.userData) {
				state.userData.last_conv = action.payload.last_conv;
				return {
					...state,
				};
			} else {
				return state;
			}
		}
		default: {
			return { ...state };
		}
	}
};
// export const rootReducer = (
// 	state: Tstate = {
// 		userData: null,
// 		isLoggedIn: false,
// 	},
// 	action: any,
// ) => {
// 	switch (action.type) {
// 		case LOGIN:
// 		case LOGOUT:
// 			return {
// 				...state,
// 				...action.payload,
// 			};

// 		default: {
// 			return { ...state };
// 		}
// 	}
// };
export default rootReducer;
