// store/reducers/index.ts
import { Reducer } from 'redux';
// const rootReducer = combineReducers({
// 	auth: authSlice.reducer,
// });
export const LOGIN = 'login';
export const LOGOUT = 'logout';
export type TrootState = {
	// 상태의 인터페이스
	userData: {
		user_email: string;
		user_id: number;
		user_name: string;
		last_conv: number;
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
